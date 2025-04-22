import { UNSUPPORTED_PROPERTY } from '../errorMessages';
import { type HLSA, InteractionStateCssMapping, type InteractionStates } from '@kiskadee/schema';
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
 *   color is represented as a JSON string that parses to an array of 4 numbers, e.g., [0,0,0,1].
 *
 * The color is converted into a hexadecimal string using convertHslaToHex.
 * If the interaction state has an equivalent CSS pseudo-selector, it is appended to the selector.
 *
 * @param styleKey - The shadow style key to be transformed.
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

  // Regular expression to capture the optional interaction state and the content within the brackets.
  // Pattern:
  //   ^shadow(?:--(\w+))?__\[(.*)]$
  // Group 1 (optional): the interaction state (e.g., hover)
  // Group 2: shadow content in the format "x,y,blur,color"
  const regex = /^shadow(?:--(\w+))?__\[(.*)]$/;
  const match = styleKey.match(regex);
  if (match === null) {
    throw new Error(`Invalid shadow style key format: ${styleKey}`);
  }

  // Determine the interaction state; default to "rest" if not specified.
  const interactionState = (match[1] ?? 'rest') as InteractionStates;

  // Check that the interaction state is valid according to our mapping.
  if (interactionState in InteractionStateCssMapping === false) {
    throw new Error(
      `Unsupported interaction state "${interactionState}" in shadow key "${styleKey}".`
    );
  }

  const cssPseudo = InteractionStateCssMapping[interactionState as InteractionStates];

  const shadowValue = match[2];

  // Regular expression to capture the first three numeric parts and the remaining value as color.
  // Expected format: "x,y,blur,color"
  const partsRegex = /^(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(.+)$/;
  const partsMatch = shadowValue.match(partsRegex);
  if (!partsMatch) {
    throw new Error(`Invalid shadow values in key: ${styleKey}`);
  }

  const x = partsMatch[1];
  const y = partsMatch[2];
  const blur = partsMatch[3];
  const hlsaRaw = partsMatch[4];

  // Attempt to parse the color part as JSON.
  // It should parse to an array of 4 numbers, e.g., [0,0,0,1].
  let parsedHLSA: unknown;
  try {
    parsedHLSA = JSON.parse(hlsaRaw);
    // If the parsed value is a string starting with '[', try parsing it again.
    if (typeof parsedHLSA === 'string' && parsedHLSA.startsWith('[')) {
      parsedHLSA = JSON.parse(parsedHLSA);
    }
  } catch (e) {
    parsedHLSA = null;
  }
  if (!parsedHLSA || !Array.isArray(parsedHLSA) || parsedHLSA.length !== 4) {
    throw new Error('Invalid shadow color value.');
  }
  const hexColor = convertHslaToHex(parsedHLSA as HLSA);

  // Construct the CSS selector.
  // If a pseudo-selector is defined for the interaction state, it is appended to the selector.
  const selector = `.${styleKey}${cssPseudo}`;

  return `${selector} { box-shadow: ${x}px ${y}px ${blur}px ${hexColor}; }`;
}
