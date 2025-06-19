import type { Appearance, ClassNameMap, InteractionState, SingleColor } from '@kiskadee/schema';
import { elementClassNameMap, styleKeyUsageMap } from '../../utils';
import { generateCssRuleFromStyleKey } from '../../phrase-2-convert-style-key-to-css/generateCss';

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
 * Note: Appearance never contains a "ref" key so that part is omitted.
 */
export function convertElementAppearanceToStyleKey(
  componentName: string,
  elementName: string,
  appearance: Appearance
) {
  let classNameMap = elementClassNameMap;

  // Process non-shadow properties
  for (const [key, value] of Object.entries(appearance)) {
    if (key.startsWith('shadow') === false) {
      if (
        typeof value === 'boolean' ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        Array.isArray(value)
      ) {
        // Generate style key
        const formattedValue = Array.isArray(value) ? JSON.stringify(value) : value;
        const styleKey = `${key}__${formattedValue}`;
        styleKeyUsageMap[styleKey] = (styleKeyUsageMap[styleKey] || 0) + 1;

        // Map class name
        const { className } = generateCssRuleFromStyleKey(styleKey);
        const componentMap = classNameMap[componentName] ?? {};
        const elementMap = componentMap[elementName] ?? { rest: [] };
        elementMap?.rest?.push(className);
        const rest = elementMap.rest;

        classNameMap = {
          ...classNameMap,
          [componentName]: {
            ...componentMap,
            [elementName]: {
              ...elementMap,
              rest
            }
          }
        };
      }
    }
  }

  console.log({ nextState: JSON.stringify(classNameMap) });

  // Process shadow properties, if any exist.
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
      const shadowKey =
        state === 'rest'
          ? `shadow__[${x},${y},${blur},${JSON.stringify(color)}]`
          : `shadow--${state}__[${x},${y},${blur},${JSON.stringify(color)}]`;
      styleKeyUsageMap[shadowKey] = (styleKeyUsageMap[shadowKey] || 0) + 1;

      // Map class name
      const { className } = generateCssRuleFromStyleKey(shadowKey);
      const componentMap = classNameMap[componentName] ?? {};
      const elementMap = componentMap[elementName] ?? {};
      const current = elementMap[state] ?? [];
      const nextElementMap = {
        ...elementMap,
        [state]: [...current, className]
      };

      classNameMap = {
        ...classNameMap,
        [componentName]: {
          ...componentMap,
          [elementName]: nextElementMap
        }
      };

      console.log({ nextState: JSON.stringify(classNameMap) });
    }
  }
}
