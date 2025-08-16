import {
  classNameCssPseudoSelector,
  type ColorProperty,
  CssColorProperty,
  type HLSA,
  InteractionStateCssPseudoSelector
} from '@kiskadee/schema';
import { convertHslaToHex } from '../utils/convertHslaToHex';
import type { GeneratedCss } from '../phrase2.types';

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
 * 2. Reference keys ("=="): generates a parent rule with a pseudo-state and
 *    a nested rule targeting the child selector. Also supports legacy "::ref".
 *
 * @param styleKey - the style token, e.g. "boxColor--hover__[240,50,50,0.5]" or
 *                   "boxColor==hover__[240,50,50,0.5]"
 * @param className
 * @returns GeneratedCss containing:
 *   - className: token without dot prefix, for use in HTML
 *   - cssRule: full CSS text including selector(s)
 *   - parentClassName: only for reference cases (== or ::ref), the full token for the parent selector
 */
export function transformColorKeyToCss(styleKey: string, className: string): string {
  // Extract HSLA values from brackets at the end; error if missing.
  const hslaMatch = styleKey.match(/\[([^\]]+)]$/);
  if (hslaMatch === null) {
    throw new Error(ERROR_INVALID_KEY_FORMAT);
  }
  const hsla = hslaMatch[1].split(',').map(Number) as HLSA;
  const hex = convertHslaToHex(hsla);

  // Base color property, e.g. "background-color" or "color"
  // Support both non-ref ("--" or "__") and ref ("==") separators
  const colorProperty = styleKey.split(/==|--|__/)[0] as ColorProperty;
  const cssProperty = CssColorProperty[colorProperty];

  // Prepare interaction state patterns (e.g. "hover", "focus", ...)
  const states = Object.values(InteractionStateCssPseudoSelector).map((s) => s.slice(1));
  const inlineStateRegex = new RegExp(`--(${states.join('|')})(?=__)`);
  const newRefStateOnChildRegex = new RegExp(`==(${states.join('|')})(?=$)`);

  let cssRule: string;

  const isRef = styleKey.includes('==');

  if (!isRef) {
    // Simple class may include a pseudo-state
    const match = styleKey.match(inlineStateRegex);
    if (match !== null) {
      cssRule = `.${className}:${match[1]} { ${cssProperty}: ${hex}; }`;
    } else {
      cssRule = `.${className} { ${cssProperty}: ${hex}; }`;
    }
    return cssRule;
  }

  // Reference state: split out child selector
  const [child] = styleKey.split('__');

  let state: string | undefined = undefined;
  const match = child.match(newRefStateOnChildRegex);
  state = match ? match[1] : undefined;

  if (state === undefined || state === '') {
    throw new Error(ERROR_REF_REQUIRE_STATE);
  }

  return `.-a:${state} .${className} { ${cssProperty}: ${hex}; }`;
}
