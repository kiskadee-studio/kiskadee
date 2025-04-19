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
 * If there is an interaction state (e.g., "hover"), the generated CSS selector adds the pseudo-selector accordingly.
 *
 * Example:
 *   transformShadowKeyToCss("shadow__[2,4,5,\"[0,0,0,1]\"]")
 *   returns:
 *     ".shadow__[2,4,5,\"[0,0,0,1]\"] { box-shadow: 2px 4px 5px rgba(0, 0, 0, 1); }"
 *
 *   transformShadowKeyToCss("shadow--hover__[6,8,10,\"[0,0,0,0.5]\"]")
 *   returns:
 *     ".shadow--hover__[6,8,10,\"[0,0,0,0.5]\"]:hover { box-shadow: 6px 8px 10px rgba(0, 0, 0, 0.5); }"
 *
 * @param styleKey - The style key to be transformed.
 * @returns A string containing the resulting CSS rule.
 *
 * @throws Error if the style key does not follow the expected pattern.
 */
export function transformShadowKeyToCss(styleKey: string): string {
  // Verify that the key starts with "shadow"
  if (!styleKey.startsWith('shadow')) {
    throw new Error(`Unsupported property for shadow: ${styleKey}`);
  }

  // Define regex to capture the optional state and content between the brackets.
  // Pattern:
  //   ^shadow(?:--(\w+))?__\[(.*)\]$
  // Group 1 (optional): the interaction state (e.g., hover)
  // Group 2: shadow content: "x,y,blur,color"
  const regex = /^shadow(?:--(\w+))?__\[(.*)\]$/;
  const match = styleKey.match(regex);
  if (!match) {
    throw new Error(`Invalid shadow style key format: ${styleKey}`);
  }

  // If group 1 exists, it represents the interaction state; otherwise, the state is "rest"
  const state = match[1] ? match[1] : 'rest';
  const content = match[2].trim();

  // The content should contain 4 parts: x, y, blur, and color.
  // Since the color part may contain commas (e.g., "[0,0,0,1]"), we use a regex to capture the first 3 numeric values and the rest as color.
  const partsRegex = /^(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(.+)$/;
  const partsMatch = content.match(partsRegex);
  if (!partsMatch) {
    throw new Error(`Invalid shadow values in key: ${styleKey}`);
  }

  const x = partsMatch[1];
  const y = partsMatch[2];
  const blur = partsMatch[3];
  let rawColor = partsMatch[4].trim();

  // Attempt to parse the color part as JSON.
  // If it is a JSON string representing an array of numbers,
  // convert it to an rgba format. Otherwise, use the value as-is.
  let cssColor: string;
  try {
    const parsed = JSON.parse(rawColor);
    if (typeof parsed === 'string' && parsed.trim().startsWith('[')) {
      const colorArray = JSON.parse(parsed);
      if (Array.isArray(colorArray) && colorArray.length === 4) {
        cssColor = `rgba(${colorArray.join(', ')})`;
      } else {
        cssColor = parsed;
      }
    } else if (Array.isArray(parsed) && parsed.length === 4) {
      cssColor = `rgba(${parsed.join(', ')})`;
    } else if (typeof parsed === 'string') {
      cssColor = parsed;
    } else {
      cssColor = rawColor;
    }
  } catch (e) {
    // If parsing fails, use the raw value.
    cssColor = rawColor;
  }

  // Append the "px" unit to the numeric values.
  const xPx = `${x}px`;
  const yPx = `${y}px`;
  const blurPx = `${blur}px`;

  // Define the CSS selector; if the state is not "rest", add the corresponding pseudo-selector.
  // For example, if state === "hover", the selector becomes:
  //   .shadow--hover__[...]:hover { ... }
  const pseudo = state !== 'rest' ? `:${state}` : '';
  const selector = `.${styleKey}${pseudo}`;

  // Return the formatted CSS rule.
  return `${selector} { box-shadow: ${xPx} ${yPx} ${blurPx} ${cssColor}; }`;
}
