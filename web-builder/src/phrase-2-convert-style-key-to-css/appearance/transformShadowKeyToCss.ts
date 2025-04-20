import { UNSUPPORTED_PROPERTY } from '../errorMessages';
import { InteractionStateCssMapping, type InteractionStates } from '@kiskadee/schema';
import { convertHslaToHex } from '../utils/convertHslaToHex';

/**
 * Transforms a shadow style key into a valid CSS rule.
 *
 * The shadow style key should follow the format:
 *   - For the default state ("rest"): "shadow__[x,y,blur,color]"
 *   - For other interaction states: "shadow--{state}__[x,y,blur,color]"
 *
 * Where:
 *   x, y, and blur are numeric values (without units) and
 *   color is represented using JSON.stringify (e.g., "\"[0,0,0,1]\"").
 *
 * The color is converted to a hexadecimal string using convertHslaToHex.
 * If the interaction state has a CSS pseudo-selector equivalent, it is applied.
 *
 * @param styleKey - The style key to be transformed.
 * @returns A string containing the resulting CSS rule.
 *
 * @throws Error if the style key does not follow the expected pattern,
 *         if its property is unsupported, or if the interaction state is unrecognized.
 */
export function transformShadowKeyToCss(styleKey: string): string {
  // Verify that the key starts with "shadow"
  if (!styleKey.startsWith('shadow')) {
    throw new Error(UNSUPPORTED_PROPERTY('shadow', styleKey));
  }

  // Regex to capture the optional state and the content between the brackets.
  // Pattern:
  //   ^shadow(?:--(\w+))?__\[(.*)\]$
  // Group 1 (optional): the interaction state (e.g., hover)
  // Group 2: shadow content: "x,y,blur,color"
  const regex = /^shadow(?:--(\w+))?__\[(.*)]$/;
  const match = styleKey.match(regex);
  if (match === null) {
    throw new Error(`Invalid shadow style key format: ${styleKey}`);
  }

  // Determine interaction state; default to "rest" if not specified.
  const interactionState = (match[1] ?? 'rest') as InteractionStates;

  // Check that the interaction state is valid, according to our mapping.
  if (interactionState in InteractionStateCssMapping === false) {
    throw new Error(
      `Unsupported interaction state "${interactionState}" in shadow key "${styleKey}".`
    );
  }

  const cssPseudo = InteractionStateCssMapping[interactionState as InteractionStates];

  const shadowValue = match[2];

  // Regex to capture the first 3 numeric parts and the remaining as color.
  const partsRegex = /^(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(.+)$/;
  const partsMatch = shadowValue.match(partsRegex);
  if (!partsMatch) {
    throw new Error(`Invalid shadow values in key: ${styleKey}`);
  }

  const x = partsMatch[1];
  const y = partsMatch[2];
  const blur = partsMatch[3];
  const rawColor = partsMatch[4];

  // Try to parse the color part as JSON.
  // When successful and an array of 4 numbers is found, convert it to a hex color.
  let hexColor: string;
  try {
    let parsed = JSON.parse(rawColor);
    if (typeof parsed === 'string' && parsed.trim().startsWith('[')) {
      parsed = JSON.parse(parsed);
    }
    if (Array.isArray(parsed) && parsed.length === 4) {
      hexColor = convertHslaToHex(parsed as [number, number, number, number]);
    } else if (typeof parsed === 'string') {
      hexColor = parsed;
    } else {
      hexColor = rawColor;
    }
  } catch (e) {
    // If parsing fails, use the raw value.
    hexColor = rawColor;
  }

  // Construct the CSS selector.
  // If the pseudo-selector is not empty, attach it at the end.
  const selector = `.${styleKey}${cssPseudo}`;

  return `${selector} { box-shadow: ${x}px ${y}px ${blur}px ${hexColor}; }`;
}
