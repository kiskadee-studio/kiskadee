import {
  type HLSA,
  type InteractionState,
  InteractionStateCssPseudoSelector
} from '@kiskadee/schema';
import {
  INVALID_SHADOW_COLOR_VALUE,
  UNSUPPORTED_INTERACTION_STATE,
  UNSUPPORTED_PROPERTY_NAME,
  UNSUPPORTED_VALUE
} from '../../errorMessages';
import { convertHslaToHex } from '../../utils/convertHslaToHex';

/**
 * Builds a CSS rule that sets the box-shadow property from a compact shadow style key.
 *
 * The style key must follow one of these conventions:
 * - "shadow__[x,y,blur,[h,l,s,a]]"                 — default (rest) state
 * - "shadow--<state>__[x,y,blur,[h,l,s,a]]"        — with interaction state
 *
 * Where:
 * - x, y, blur are numeric values (pixels) representing horizontal offset, vertical offset, and blur radius.
 * - [h,l,s,a] is an HSLA array for the shadow color, which will be converted to a hex color.
 * - <state> is one of the supported interaction states in InteractionStateCssPseudoSelector (e.g. "hover", "focus").
 *
 * Example:
 * ```TypeScript
 * transformShadowKeyToCss('shadow--hover__[2,4,8,[120,50,60,0.3]]', 'myClass');
 * // => ".myClass:hover { box-shadow: 2px 4px 8px #RRGGBBAA }"
 * ```
 *
 * @param styleKey - The namespaced shadow key to parse (e.g., "shadow__[-2,4,8,[0,0,0,0.5]]").
 * @param className - The CSS class name to use in the selector (without a leading dot).
 * @returns The full CSS rule string (selector plus declaration), e.g. ".foo:hover { box-shadow: 0px 2px 4px #000000FF }".
 *
 * @throws Error when:
 *   - The key does not start with the expected "shadow" property segment or the overall format is invalid.
 *   - The interaction state is unknown.
 *   - The offsets/blur/color segment cannot be parsed.
 *   - The HSLA color value is malformed.
 */
export function transformShadowKeyToCss(styleKey: string, className: string): string {
  // Extract the optional interaction state and the bracketed value.
  // Matches: shadow--<state>__[x,y,blur,[h,l,s,a]] or shadow__[x,y,blur,[h,l,s,a]]
  const regex = /^shadow(?:--(\w+))?__\[(.*)]$/;
  const match = styleKey.match(regex);

  const isUnsupportedProperty = match === null;

  if (isUnsupportedProperty === true) {
    throw new Error(UNSUPPORTED_PROPERTY_NAME('shadow', styleKey));
  }

  // Determine interaction state or default to "rest".
  const interactionState = (match[1] ?? 'rest') as InteractionState;
  const hasUnsupportedInteractionState = !(interactionState in InteractionStateCssPseudoSelector);

  if (hasUnsupportedInteractionState === true) {
    throw new Error(UNSUPPORTED_INTERACTION_STATE(interactionState, styleKey));
  }

  // Map to CSS pseudo-selector (empty string when "rest" or states without pseudo).
  const cssPseudo = InteractionStateCssPseudoSelector[interactionState] || '';

  // The inner value should be "x,y,blur,color".
  const shadowValue = match[2];
  const parts = shadowValue.match(/^([\d.]+),([\d.]+),([\d.]+),(.*)$/);
  const hasInvalidFormat = parts === null;

  if (hasInvalidFormat === true) {
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

  // Produce a minimal CSS rule targeting the provided class name.
  // Note: className should not include a leading dot.
  return `.${className}${cssPseudo} { box-shadow: ${x}px ${y}px ${blur}px ${hexColor} }`;
}
