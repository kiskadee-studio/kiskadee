import type { Appearance, ClassNameMap, InteractionState, SingleColor } from '@kiskadee/schema';

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

function updateElementStyleKeyMap(
  elementStyleKeyMap: ClassNameMap,
  componentName: string,
  elementName: string,
  state: InteractionState,
  styleKey: string
): ClassNameMap {
  const componentMap = elementStyleKeyMap[componentName] ?? {};
  const elementMap = componentMap[elementName] ?? {};
  const currentStyleKeys = elementMap[state] ?? [];

  Object.assign(elementStyleKeyMap, {
    [componentName]: {
      ...componentMap,
      [elementName]: {
        ...elementMap,
        [state]: [...currentStyleKeys, styleKey]
      }
    }
  });

  return elementStyleKeyMap;
}

/**
 * Processes the given "appearance" object by extracting style-related properties
 * and generating keys for the `styleUsageMap`.
 *
 * Non-shadow properties are processed using the pattern:
 *   {property}__{value}
 * where if the value is an array, JSON.stringify is used.
 *
 * Shadow properties are processed as follows:
 *   - For the default state (rest): shadow__[x,y,blur,[color]]
 *   - For other states:             shadow--{state}__[x,y,blur,[color]]
 *
 * The numbers x, y, blur are included directly (without units) and the color,
 * which is of type SingleColor, is represented as a literal array.
 *
 * Note: Appearance never contains a "ref" key, so that part is omitted.
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

  // Shadows are treated differently from other properties because in CSS, even though shadows
  // have different attributes like x, y, blur and color, they are treated as a single
  // property, requiring value unification.

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
      // Generate style key
      const x = getShadowValue(shadowX, state, 0);
      const y = getShadowValue(shadowY, state, 0);
      const blur = getShadowValue(shadowBlur, state, 0);
      // Keep the color as a simple array (SingleColor)
      const color: SingleColor = getShadowValue(shadowColor, state, [0, 0, 0, 1]);
      // Create the key as a literal array string.
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
