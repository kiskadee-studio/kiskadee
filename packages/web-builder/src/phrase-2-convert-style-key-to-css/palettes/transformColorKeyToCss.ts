import {
  type ColorKeys,
  CssColorProperty,
  type HLSA,
  InteractionStateCssMapping
} from '@kiskadee/schema';
import { convertHslaToHex } from '../utils/convertHslaToHex';
import type { GeneratedCss } from '../phrase2.types';

export const ERROR_INVALID_KEY_FORMAT =
  'Invalid key format. Expected value in square brackets at the end.';
export const ERROR_REF_REQUIRE_STATE =
  'Invalid key format. "::ref" requires a preceding interaction state.';

/**
 * Transform a style key into its corresponding CSS rule representation.
 *
 * Handles two cases:
 * 1. Simple keys (no "::ref"): generates a class rule, optionally with a pseudo-state
 *    if the key contains an interaction state (e.g. "--hover__").
 * 2. Reference keys ("::ref"): generates a parent rule with a pseudo-state and
 *    a nested rule targeting the child selector.
 *
 * @param styleKey - the style token, e.g. "bgColor--hover__[240,50,50,0.5]" or
 *                   "bgColor--hover::ref__[240,50,50,0.5]"
 * @returns GeneratedCss containing:
 *   - className: token without dot prefix, for use in HTML
 *   - cssRule: full CSS text including selector(s)
 *   - parentClassName: only for ::ref cases, the full token for the parent selector
 */
export function transformColorKeyToCss(styleKey: string): GeneratedCss {
  // Extract HSLA values from brackets at end; error if missing.
  const hslaMatch = styleKey.match(/\[([^\]]+)]$/);
  if (hslaMatch === null) {
    throw new Error(ERROR_INVALID_KEY_FORMAT);
  }
  const hsla = hslaMatch[1].split(',').map(Number) as HLSA;
  const hex = convertHslaToHex(hsla);

  // Base color property, e.g. "background-color" or "color"
  const colorKey = styleKey.split(/--|__/)[0] as ColorKeys;
  const cssProp = CssColorProperty[colorKey];

  // Prepare interaction state patterns (e.g. "hover", "focus", ...)
  const states = Object.values(InteractionStateCssMapping).map((s) => s.slice(1));
  const inlineStateRegex = new RegExp(`--(${states.join('|')})(?=__)`);
  const refStateRegex = new RegExp(`--(${states.join('|')})(?=::ref)`);

  let className: string;
  let parentClassName: string | undefined;
  let cssRule: string;

  // Determine if this is a reference style
  if (!styleKey.includes('::ref')) {
    // Simple class, may include a pseudo-state
    className = styleKey;
    const match = styleKey.match(inlineStateRegex);
    if (match !== null) {
      cssRule = `.${styleKey}:${match[1]} { ${cssProp}: ${hex}; }`;
    } else {
      cssRule = `.${styleKey} { ${cssProp}: ${hex}; }`;
    }
  } else {
    // Reference state: split out child selector
    const [child] = styleKey.split('__');
    className = child;
    const match = child.match(refStateRegex);
    if (match === null) {
      throw new Error(ERROR_REF_REQUIRE_STATE);
    }
    parentClassName = styleKey;
    cssRule = `.${styleKey}:${match[1]} .${child} { ${cssProp}: ${hex}; }`;
  }

  return { className, parentClassName, cssRule };
}
