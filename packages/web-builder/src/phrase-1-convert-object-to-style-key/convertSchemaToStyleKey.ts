import type { ComponentKeys, Schema } from '@kiskadee/schema';
import { convertAppearanceToStyleKey } from './appearance/convertAppearanceToStyleKey';
import { convertPalettesToStyleKey } from './palettes/convertPalettesToStyleKey';
import { styleUsageMap } from '../utils';
import { convertDimensionsToStyleKey } from './dimensions/convertDimensionsToStyleKey';

/**
 * Processes a Schema object by iterating over each component's elements.
 * For each style object, it processes the appearance, dimensions, and palettes
 * (if defined) using their respective methods. Finally, the accumulated styleUsageMap
 * is logged to the console.
 *
 * @param schema - The Schema object to process.
 */
export function convertSchemaToStyleKey(schema: Schema): { [p: string]: number } {
  // Iterate over each component in the schema.
  for (const componentKey in schema.components) {
    const component = schema.components[componentKey as ComponentKeys];

    // Iterate over each element within the component.
    for (const elementKey in component.elements) {
      const style = component.elements[elementKey];

      // Process appearance if defined.
      if (style.appearance) {
        convertAppearanceToStyleKey(style.appearance);
      }

      // Process dimensions if defined.
      if (style.dimensions) {
        convertDimensionsToStyleKey(style.dimensions);
      }

      // Process palettes if defined.
      if (style.palettes) {
        // The palette property is a record of Palettes.
        for (const palette of Object.values(style.palettes)) {
          convertPalettesToStyleKey(palette);
        }
      }
    }
  }

  // Log the final style usage map.
  return Object.fromEntries(Object.entries(styleUsageMap).sort(([a], [b]) => a.localeCompare(b)));
}
