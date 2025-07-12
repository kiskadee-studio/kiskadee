import type { ClassNameMap, InteractionState } from '@kiskadee/schema';

export type StyleKeyUsageMap = Record<string, number>;

export const styleKeyUsageMap: StyleKeyUsageMap = {};
export const classNameMap: ClassNameMap = {};
export const elementStyleKeyMap: ClassNameMap = {};

/**
 * Adds a style key to the specified component and element state in the ClassNameMap, preserving
 * existing keys.
 */
export function updateElementStyleKeyMap(
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
