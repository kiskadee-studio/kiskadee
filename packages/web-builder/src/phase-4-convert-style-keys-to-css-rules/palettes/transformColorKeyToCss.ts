import {
  type ColorProperty,
  CssColorProperty,
  classNameCssPseudoSelector,
  type HLSA,
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
  const hsla = hslaMatch[1].split(',').map(Number) as HLSA;
  const hex = convertHslaToHex(hsla);

  // Base color property, e.g. "background-color" or "color"
  // Support both non-ref ("--" or "__") and ref ("==") separators
  const propertyName = styleKey.split(/==|--|__/)[0] as ColorProperty;
  const colorProperty = CssColorProperty[propertyName];

  // Prepare interaction state patterns (e.g. "hover", "focus", ...)
  const states = Object.values(InteractionStateCssPseudoSelector).map((s) => s.slice(1));
  const inlinePseudoClassRegex = new RegExp(`--(${states.join('|')})(?=__)`);
  const newRefStateOnChildRegex = new RegExp(`==(${states.join('|')})(?=$)`);

  let cssRule: string;

  const isRef = styleKey.includes('==');
  const hasRef = isRef === true;

  if (hasRef === false) {
    // Simple class may include a pseudo-state
    const match = styleKey.match(inlinePseudoClassRegex);
    const pseudoClass = match ? match[1] : undefined;
    const hasPseudoClass = pseudoClass !== undefined;
    if (hasPseudoClass === true) {
      // build selectors list: native pseudo-class plus optional forced-class
      const selectors: string[] = [];
      selectors.push(`.${className}:${pseudoClass}`);

      const shouldForce = forceState === true;
      if (shouldForce === true) {
        const forcedSuffix = (classNameCssPseudoSelector as Record<string, string>)[pseudoClass];
        const hasForcedSuffix = forcedSuffix !== undefined && forcedSuffix !== '';
        if (hasForcedSuffix === true) {
          // forcedSuffix already contains the short token (e.g. "-h"); apply as a separate class on the same element
          selectors.push(`.${className}.${forcedSuffix}`);
        }
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
  parentSelectors.push(`.-a:${pseudoClass} .${className}`);

  const shouldForceRef = forceState === true;
  if (shouldForceRef === true) {
    const forcedSuffix = (classNameCssPseudoSelector as Record<string, string>)[
      pseudoClass as unknown as string
    ];
    const hasForcedSuffix = forcedSuffix !== undefined && forcedSuffix !== '';
    if (hasForcedSuffix === true) {
      // forced class applied on the parent (parent will have both -a and forcedSuffix classes), e.g. ".-a.-h .abc"
      parentSelectors.push(`.-a.${forcedSuffix} .${className}`);
    }
  }

  const selector = parentSelectors.join(', ');
  return `${selector} { ${colorProperty}: ${hex} }`;
}
