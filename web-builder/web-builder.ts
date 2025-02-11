import type { Appearance, InteractionStatesProperties, SingleColor } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

function getShadowValue<T>(
  property: Partial<Record<InteractionStatesProperties, T>>,
  state: InteractionStatesProperties,
  defaultValue: T
): T {
  // Use the value for the given state, or fallback to the "rest" state, or finally the default
  return property[state] !== undefined
    ? property[state]
    : property.rest !== undefined
      ? property.rest
      : defaultValue;
}

/**
 * Processes the given "appearance" object and extracts style-related properties,
 * generating usage keys for the `styleUsageMap`.
 */
export function processAppearance(appearance: Appearance) {
  // Process non-shadow properties
  for (const [key, value] of Object.entries(appearance)) {
    if (!key.startsWith('shadow')) {
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        const keyValue = `${key}__${value}`;
        styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
      }
    }
  }

  // Check if any shadow-related property exists
  const hasShadowProperty =
    'shadowColor' in appearance ||
    'shadowX' in appearance ||
    'shadowY' in appearance ||
    'shadowBlur' in appearance;

  if (hasShadowProperty) {
    // Destructure shadow properties with defaults to empty objects
    const { shadowX = {}, shadowY = {}, shadowBlur = {}, shadowColor = {} } = appearance;

    // Create a set of all interaction states defined in any shadow-related property
    const allStates = new Set<InteractionStatesProperties>([
      ...Object.keys(shadowX),
      ...Object.keys(shadowY),
      ...Object.keys(shadowBlur),
      ...Object.keys(shadowColor)
    ] as InteractionStatesProperties[]);

    // Optional: Always process the "rest" state when any shadow is defined.
    allStates.add('rest');

    for (const state of allStates) {
      // For each required property, get the value for the given state.
      const x = getShadowValue(shadowX, state, 0);
      const y = getShadowValue(shadowY, state, 0);
      const blur = getShadowValue(shadowBlur, state, 0);
      const color: SingleColor = getShadowValue(shadowColor, state, [0, 0, 0, 1]);
      const hlsa = `hlsa-${color.join('-')}`;

      const shadowParts = [`${x}px`, `${y}px`, `${blur}px`];

      const shadowKey =
        state === 'rest'
          ? `shadow__${shadowParts.join('--')}--${hlsa}`
          : `shadow::${state}__${shadowParts.join('--')}--${hlsa}`;

      styleUsageMap[shadowKey] = (styleUsageMap[shadowKey] || 0) + 1;
    }
  }
}
