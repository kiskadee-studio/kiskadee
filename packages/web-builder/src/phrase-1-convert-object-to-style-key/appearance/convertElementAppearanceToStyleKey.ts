import type { Appearance, ClassNameMap, InteractionState, SingleColor } from '@kiskadee/schema';
import { updateElementStyleKeyMap } from '../../utils';

/**
 * Gets a shadow property value for the given interaction state, falling back to 'rest' then to a
 * default.
 */
function getShadowValue<T>(
  property: Partial<Record<InteractionState, T>>,
  state: InteractionState,
  defaultValue: T
): T {
  return property[state] !== undefined
    ? property[state]
    : property.rest !== undefined
      ? property.rest
      : defaultValue;
}

/**
 * Converts an element's appearance settings into a map of style keys for each interaction state.
 *
 * Non-shadow properties (boolean, string, number, or array) generate a 'rest' state key:
 *   {property}__{value}
 * (arrays are JSON-stringified).
 *
 * Shadow properties (shadowX, shadowY, shadowBlur, shadowColor) are unified:
 *   - Determines all states present on any shadow property, plus 'rest'.
 *   - For each state, missing values fall back to 'rest', then to defaults
 *     (0 for offsets/blur, [0,0,0,1] for color).
 *   - Generates keys:
 *       rest:     shadow__[x,y,blur,[r,g,b,a]]
 *       non-rest: shadow--{state}__[x,y,blur,[r,g,b,a]]
 */
export function convertElementAppearanceToStyleKey(
  componentName: string,
  elementName: string,
  appearance: Appearance
): ClassNameMap {
  let elementStyleKeyMap: ClassNameMap = {};

  for (const [property, value] of Object.entries(appearance)) {
    if (property.startsWith('shadow') === false) {
      if (
        typeof value === 'boolean' ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        Array.isArray(value)
      ) {
        const formattedValue = Array.isArray(value) ? JSON.stringify(value) : value;
        const styleKey = `${property}__${formattedValue}`;
        elementStyleKeyMap = updateElementStyleKeyMap(
          elementStyleKeyMap,
          componentName,
          elementName,
          'rest',
          styleKey
        );
      }
    }
  }

  // CSS handles shadows as a single property despite having multiple attributes (x, y, blur, color).
  // So we need to combine all shadow properties into a unified value for each state.

  const hasShadowProperty =
    'shadowColor' in appearance ||
    'shadowX' in appearance ||
    'shadowY' in appearance ||
    'shadowBlur' in appearance;

  if (hasShadowProperty === true) {
    const { shadowX = {}, shadowY = {}, shadowBlur = {}, shadowColor = {} } = appearance;
    const allStates = new Set<InteractionState>([
      ...Object.keys(shadowX),
      ...Object.keys(shadowY),
      ...Object.keys(shadowBlur),
      ...Object.keys(shadowColor)
    ] as InteractionState[]);
    allStates.add('rest');

    for (const state of allStates) {
      const x = getShadowValue(shadowX, state, 0);
      const y = getShadowValue(shadowY, state, 0);
      const blur = getShadowValue(shadowBlur, state, 0);
      const color: SingleColor = getShadowValue(shadowColor, state, [0, 0, 0, 1]);
      const styleKey =
        state === 'rest'
          ? `shadow__[${x},${y},${blur},${JSON.stringify(color)}]`
          : `shadow--${state}__[${x},${y},${blur},${JSON.stringify(color)}]`;

      elementStyleKeyMap = updateElementStyleKeyMap(
        elementStyleKeyMap,
        componentName,
        elementName,
        state,
        styleKey
      );
    }
  }

  return elementStyleKeyMap;
}
