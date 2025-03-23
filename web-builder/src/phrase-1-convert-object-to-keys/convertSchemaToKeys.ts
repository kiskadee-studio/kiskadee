import type { ComponentKeys, Schema } from '@kiskadee/schema';
import { schema } from '@kiskadee/schema';
import { convertAppearanceToKeys } from './appearance/convertAppearanceToKeys';
import { processPalettes } from '../processPalettes';
import { styleUsageMap } from '../utils';
import { convertDimensionsToKeys } from './dimensions/convertDimensionsToKeys';

/**
 * Processes a Schema object by iterating over each component's elements.
 * For each style object, it processes the appearance, dimensions, and palettes
 * (if defined) using their respective methods. Finally, the accumulated styleUsageMap
 * is logged to the console.
 *
 * @param schema - The Schema object to process.
 */
export function convertSchemaToKeys(schema: Schema): void {
  // Iterate over each component in the schema.
  for (const componentKey in schema.components) {
    const component = schema.components[componentKey as ComponentKeys];

    // Iterate over each element within the component.
    for (const elementKey in component.elements) {
      const style = component.elements[elementKey];

      // Process appearance if defined.
      if (style.appearance) {
        convertAppearanceToKeys(style.appearance);
      }

      // Process dimensions if defined.
      if (style.dimensions) {
        // TODO: There are multiple keys with same value eg: textSize--s:md:1::bp:all__12 textSize--s:md:1__12 and textSize__12
        convertDimensionsToKeys(style.dimensions);
      }

      // Process palettes if defined.
      if (style.palettes) {
        // The palettes property is a record of Palettes.
        for (const palette of Object.values(style.palettes)) {
          processPalettes(palette);
        }
      }
    }
  }

  // Log the final style usage map.
  console.log(styleUsageMap);
}

convertSchemaToKeys(schema);
