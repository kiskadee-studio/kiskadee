import type { Appearance, InteractionStatesProperties, ShadowStyle } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

/**
 * Processes the given "appearance" object and extracts style-related properties,
 * generating usage keys for the `styleUsageMap`.
 */
export function processAppearance(appearance: Appearance) {
  // Iterates through all properties of the "appearance" object
  for (const [key, value] of Object.entries(appearance)) {
    // Handles non-shadow-related keys (e.g., general style keys like fontItalic, borderStyle, etc.)
    if (!key.startsWith('shadow')) {
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        // Constructs unique style usage keys for non-shadow properties based on their values
        const keyValue = `${key}__${value}`;
        styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
      }
    }
  }

  // Checks for shadow-related properties in the appearance object
  const hasShadowProperty =
    'shadowColor' in appearance ||
    'shadowX' in appearance ||
    'shadowY' in appearance ||
    'shadowBlur' in appearance;

  if (hasShadowProperty) {
    // Destructures shadow-related properties with default empty objects
    const { shadowX = {}, shadowY = {}, shadowBlur = {}, shadowColor = {} } = appearance;

    // Determines if any "rest" state is explicitly defined in the shadow-related properties
    const hasRestState =
      'rest' in shadowX || 'rest' in shadowY || 'rest' in shadowBlur || 'rest' in shadowColor;

    // Collects all interaction states (e.g., "rest", "hover") from the shadow-related property keys
    const interactionStates = new Set([
      ...(hasRestState ? ['rest'] : []), // Ensures inclusion of "rest" if explicitly defined
      ...Object.keys(shadowX),
      ...Object.keys(shadowY),
      ...Object.keys(shadowBlur),
      ...Object.keys(shadowColor)
    ] as InteractionStatesProperties[]);

    // Processes each interaction state to generate shadow-related style usage keys
    for (const interactionState of interactionStates) {
      // Retrieves the shadow color for the given state, defaulting to black (HLSA) if not defined
      const color = shadowColor[interactionState] || [0, 0, 0, 1]; // Default shadow color as black
      const hlsa = `hlsa-${color.join('-')}`; // Formats the HLSA color as a string

      // Retrieves shadow dimensions (x, y, blur) for the given state, defaulting to 0 if not defined
      const shadowParts = [
        `${shadowX[interactionState] || 0}px`, // Shadow X offset
        `${shadowY[interactionState] || 0}px`, // Shadow Y offset
        `${shadowBlur[interactionState] || 0}px` // Shadow blur radius
      ];

      // Constructs a unique shadow style usage key for the given state and dimensions
      const shadowKey = `shadow${interactionState === 'rest' ? '' : `::${interactionState}`}__${shadowParts.join(
        '--'
      )}--${hlsa}`;

      // Updates the style usage map with the generated shadow key
      styleUsageMap[shadowKey] = (styleUsageMap[shadowKey] || 0) + 1;
    }
  }
}
