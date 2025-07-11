import type { ComponentName, Schema } from '@kiskadee/schema';
import { convertElementDecorationToStyleKeys } from './decoration/convertElementDecorationToStyleKeys';
import { convertColorsToStyleKeys } from './colors/convertColorsToStyleKeys';
import { styleKeyUsageMap } from '../utils';
import { convertElementScalesToStyleKeys } from './scales/convertElementScalesToStyleKeys';

/**
 * Processes a Schema object by iterating over each component's elements.
 * For each style object, it processes the decoration, scales, and colors
 * (if defined) using their respective methods. Finally, the accumulated styleUsageMap
 * is logged to the console.
 *
 * @param schema - The Schema object to process.
 */
export function convertSchemaToStyleKeyList(schema: Schema): { [p: string]: number } {
  // Iterate over each component in the schema.
  for (const c in schema.components) {
    const componentName = c as ComponentName;
    const component = schema.components[componentName];

    // Iterate over each element within the component.
    for (const elementName in component?.elements) {
      const element = component.elements[elementName];

      if (element.decorations) {
        console.log({ appearance: element.decorations });
        const appearanceClassNameMap = convertElementDecorationToStyleKeys(element.decorations);
        console.log({ appearanceClassNameMap: JSON.stringify(appearanceClassNameMap) });
      }

      if (element.scales) {
        const dimensionsClassNameMap = convertElementScalesToStyleKeys(element.scales);
        console.log({ dimensionsClassNameMap: JSON.stringify(dimensionsClassNameMap) });
      }

      if (element.palettes) {
        for (const palette of Object.values(element.palettes)) {
          const colorClassNameMap = convertColorsToStyleKeys(palette);
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
