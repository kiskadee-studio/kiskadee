import {
  UNSUPPORTED_PROPERTY,
  UNSUPPORTED_VALUE,
  UNSUPPORTED_INTERACTION_STATE,
  INVALID_SHADOW_COLOR_VALUE
} from '../errorMessages';
import { type HLSA, InteractionStateCssMap, type InteractionState } from '@kiskadee/schema';
import { convertHslaToHex } from '../utils/convertHslaToHex';
import type { GeneratedCss } from '../phrase2.types';

/**
 * Transforms a generated shadow style key into a CSS rule.
 *
 * @example
 * ```ts
 * const { className, cssRule } = transformShadowKeyToCss(
 *   "shadow--hover__[2,4,8,[120,50,60,0.3]]"
 * );
 * // className: "shadow--hover__[2,4,8,[120,50,60,0.3]]"
 * // cssRule: ".shadow--hover__[2,4,8,[120,50,60,0.3]]:hover { box-shadow: 2px 4px 8px #RRGGBBAA; }"
 * ```
 *
 * The `styleKey` must match the pattern:
 *   "shadow__[x,y,blur,[h,l,s,a]]"             — default (rest) state
 *   "shadow--<state>__[x,y,blur,[h,l,s,a]]"     — with interaction state
 *
 * Where:
 *   - `x`, `y`, `blur` are numeric offsets and blur radius in pixels.
 *   - `[h,l,s,a]` is an HSLA color array (hue, lightness, saturation, alpha).
 *   - `<state>` is one of the supported interaction states (e.g., hover, pressed).
 *
 * @param styleKey - Generated shadow key to transform
 * @returns An object with:
 *   - `className`: the original key
 *   - `cssRule`: the corresponding CSS rule string
 * @throws Error if the key format, interaction state, values, or color are invalid
 */
export function transformShadowKeyToCss(styleKey: string): GeneratedCss {
  // Extract the optional interaction state and the bracketed value
  const regex = /^shadow(?:--(\w+))?__\[(.*)]$/;
  const match = styleKey.match(regex);
  if (match === null) {
    throw new Error(UNSUPPORTED_PROPERTY('shadow', styleKey));
  }

  // Determine interaction state or default to "rest"
  const interactionState = (match[1] ?? 'rest') as InteractionState;
  if (!(interactionState in InteractionStateCssMap)) {
    throw new Error(UNSUPPORTED_INTERACTION_STATE(interactionState, styleKey));
  }

  // Map to CSS pseudo-selector (empty string for "rest" or states without a pseudo)
  const cssPseudo = InteractionStateCssMap[interactionState] || '';

  // The inner value should be "x,y,blur,color"
  const shadowValue = match[2];
  const parts = shadowValue.match(/^([\d.]+),([\d.]+),([\d.]+),(.*)$/);
  if (!parts) {
    // Invalid format for offsets/blur/color
    throw new Error(UNSUPPORTED_VALUE('shadow', shadowValue, styleKey));
  }

  // Parse numeric values
  const x = Number(parts[1]);
  const y = Number(parts[2]);
  const blur = Number(parts[3]);
  const colorPart = parts[4].trim();

  // Convert HSLA array to hexadecimal string
  let hexColor: string;
  try {
    const hsla = JSON.parse(colorPart) as HLSA;
    hexColor = convertHslaToHex(hsla);
  } catch {
    // Malformed HSLA value
    throw new Error(INVALID_SHADOW_COLOR_VALUE);
  }

  // Build CSS rule
  const className = styleKey;
  const cssRule = `.${className}${cssPseudo} { box-shadow: ${x}px ${y}px ${blur}px ${hexColor}; }`;

  return { className, cssRule };
}
