import type { ComponentKeys, Schema } from '@kiskadee/schema';
import { convertElementAppearanceToStyleKey } from './appearance/convertElementAppearanceToStyleKey';
import { convertColorsToStyleKeys } from './colors/convertColorsToStyleKeys';
import { styleKeyUsageMap } from '../utils';
import { convertDimensionsToStyleKey } from './dimensions/convertDimensionsToStyleKey';

/**
 * Processes a Schema object by iterating over each component's elements.
 * For each style object, it processes the appearance, dimensions, and colors
 * (if defined) using their respective methods. Finally, the accumulated styleUsageMap
 * is logged to the console.
 *
 * @param schema - The Schema object to process.
 */
export function convertSchemaToStyleKeyList(schema: Schema): { [p: string]: number } {
  // Iterate over each component in the schema.
  for (const componentName in schema.components) {
    const component = schema.components[componentName as ComponentKeys];

    // Iterate over each element within the component.
    for (const elementName in component.elements) {
      const element = component.elements[elementName];

      if (element.appearance) {
        console.log({ appearance: element.appearance });
        const appearanceClassNameMap = convertElementAppearanceToStyleKey(
          componentName,
          elementName,
          element.appearance
        );
        console.log({ appearanceClassNameMap: JSON.stringify(appearanceClassNameMap) });
      }

      if (element.dimensions) {
        const dimensionsClassNameMap = convertDimensionsToStyleKey(
          componentName,
          elementName,
          element.dimensions
        );
        console.log({ dimensionsClassNameMap: JSON.stringify(dimensionsClassNameMap) });
      }

      if (element.palettes) {
        for (const palette of Object.values(element.palettes)) {
          const colorClassNameMap = convertColorsToStyleKeys(componentName, elementName, palette);
          console.log({ colorClassNameMap: JSON.stringify(colorClassNameMap) });
        }
      }
    }
  }

  // Log the final style usage map.
  return Object.fromEntries(
    Object.entries(styleKeyUsageMap).sort(([a], [b]) => a.localeCompare(b))
  );
}
