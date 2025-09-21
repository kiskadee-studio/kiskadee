import {
  type ColorProperty,
  CssColorProperty,
  classNameCssPseudoSelector,
  type HSLA,
  InteractionStateCssPseudoSelector,
  type StyleKey
} from '@kiskadee/schema';
import { convertHslaToHex } from '../utils/convertHslaToHex';

export const ERROR_INVALID_KEY_FORMAT =
  'Invalid key format. Expected value in square brackets at the end.';
export const ERROR_REF_REQUIRE_STATE =
  'Invalid key format. Reference "==" requires a preceding non-rest interaction state.';

/**
 * Transform a style key into its corresponding CSS rule representation.
 *
 * Handles two cases:
 * 1. Simple keys (no "=="): generates a class rule, optionally with a pseudo-state
 *    if the key contains an interaction state (e.g. "--hover__").
 * 2. Reference keys ("=="): generate a parent rule with a pseudo-state and
 *    a nested rule targeting the child selector. Also supports legacy "::ref".
 *
 * @param styleKey - the style token, e.g. "boxColor--hover__[240,50,50,0.5]" or
 *                   "boxColor==hover__[240,50,50,0.5]"
 * @param className - the CSS class name to use for the generated rule (without the leading dot).
 *                    Usually this is the shortened token assigned to the styleKey (for example "a"
 *                    or "abc"). The function will emit selectors using `.${className}`.
 * @param forceState - when true and a pseudo-class is present, also include the corresponding
 *                     "forced" CSS class selector (from classNameCssPseudoSelector) alongside
 *                     the native pseudo-class so the same style can be applied by adding that
 *                     class in HTML. Example: if pseudo-class is "hover" and its forced suffix
 *                     is "-h", the generated selector list will include ".abc:hover, .abc.-h" for
 *                     inline rules or ".-a:hover .abc, .-a.-h .abc" for parent-ref rules.
 * @returns GeneratedCss containing:
 *   - className: token without a dot prefix, for use in HTML
 *   - cssRule: full CSS text including selector(s)
 *   - parentClassName: only for reference cases (== or ::ref), the full token for the parent selector
 */
export function transformColorKeyToCss(
  styleKey: StyleKey,
  className: string,
  forceState?: boolean
): string {
  // Extract HSLA values from brackets at the end; error if missing.
  const hslaMatch = styleKey.match(/\[([^\]]+)]$/);
  const hasHslaMatch = hslaMatch !== null;
  if (hasHslaMatch === false) {
    throw new Error(ERROR_INVALID_KEY_FORMAT);
  }
  const hsla = hslaMatch[1].split(',').map(Number) as HSLA;
  const hex = convertHslaToHex(hsla);

  // Base color property, e.g. "background-color" or "color"
  // Support both non-ref ("--" or "__") and ref ("==") separators
  const propertyName = styleKey.split(/==|--|__/)[0] as ColorProperty;
  const colorProperty = CssColorProperty[propertyName];

  // Prepare interaction state patterns using known state keys rather than pseudo map,
  // so we can support states that intentionally have no native pseudo (e.g., disabled).
  const stateKeys = ['hover', 'pressed', 'selected', 'focus', 'disabled', 'readOnly'];
  const inlinePseudoClassRegex = new RegExp(`--(${stateKeys.join('|')})(?=__)`);
  const newRefStateOnChildRegex = new RegExp(`==(${stateKeys.join('|')})(?=$)`);

  let cssRule: string;

  const isRef = styleKey.includes('==');
  const hasRef = isRef === true;

  if (hasRef === false) {
    // Simple class may include a pseudo-state
    const match = styleKey.match(inlinePseudoClassRegex);
    const pseudoClass = match ? (match[1] as string) : undefined;
    const hasPseudoClass = pseudoClass !== undefined;
    if (hasPseudoClass === true) {
      // build selectors list: prefer native pseudo when available; use forced class for disabled
      const selectors: string[] = [];

      const nativePseudo = (InteractionStateCssPseudoSelector as Record<string, string>)[
        pseudoClass
      ] as string | undefined;
      if (nativePseudo && nativePseudo !== '') {
        selectors.push(`.${className}${nativePseudo}`);
      }

      const forcedSuffixFor = (state: string): string => {
        return (classNameCssPseudoSelector as Record<string, string>)[state] ?? '';
      };
      const forcedSuffix = forcedSuffixFor(pseudoClass);
      const hasForcedSuffix = forcedSuffix !== '';

      const shouldAddForced =
        pseudoClass === 'disabled' || (forceState === true && hasForcedSuffix);
      if (shouldAddForced && hasForcedSuffix) {
        // forcedSuffix already contains the short token (e.g. "-h"); apply it gated by activator "-a" on the same element
        // Requirement: the forced state class alone must NOT activate styles; it must be combined with "-a".
        selectors.push(`.${className}.${forcedSuffix}.-a`);
      }

      const selector = selectors.join(', ');
      cssRule = `${selector} { ${colorProperty}: ${hex} }`;
    } else {
      cssRule = `.${className} { ${colorProperty}: ${hex} }`;
    }
    return cssRule;
  }

  // Reference pseudo-class: split out child selector
  const [child] = styleKey.split('__');

  let pseudoClass: string | undefined;
  const match = child.match(newRefStateOnChildRegex);
  pseudoClass = match ? match[1] : undefined;

  const isInvalidState = pseudoClass === undefined || pseudoClass === '';

  if (isInvalidState === true) {
    throw new Error(ERROR_REF_REQUIRE_STATE);
  }

  // parent selector with native pseudo-class and optional forced-class variant
  const parentSelectors: string[] = [];
  const nativePseudo = (InteractionStateCssPseudoSelector as Record<string, string>)[
    // biome-ignore lint/style/noNonNullAssertion: ...
    pseudoClass!
  ] as string | undefined;
  if (nativePseudo && nativePseudo !== '') {
    parentSelectors.push(`.-a${nativePseudo} .${className}`);
  }

  const forcedSuffixFor = (state: string): string => {
    return (classNameCssPseudoSelector as Record<string, string>)[state] ?? '';
  };
  // biome-ignore lint/style/noNonNullAssertion: ...
  const forcedSuffix = forcedSuffixFor(pseudoClass!);
  const hasForcedSuffix = forcedSuffix !== '';

  const shouldAddForcedRef = pseudoClass === 'disabled' || (forceState === true && hasForcedSuffix);
  if (shouldAddForcedRef && hasForcedSuffix) {
    // forced class applied on the parent (parent will have both -a and forcedSuffix classes), e.g. ".-a.-h .abc"
    parentSelectors.push(`.-a.${forcedSuffix} .${className}`);
  }

  const selector = parentSelectors.join(', ');
  return `${selector} { ${colorProperty}: ${hex} }`;
}
