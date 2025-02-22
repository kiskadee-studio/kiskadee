import type { Schema } from '@kiskadee/schema';
import { schema } from '@kiskadee/schema';
import { processAppearance } from './processAppearance';
import { processDimensions } from './processDimensions';
import { processPalettes } from './processPalettes';
import { styleUsageMap } from './utils';

// console.log({ kiskadee: JSON.stringify(kiskadee) });

/**
 * Processes a Schema object by iterating over each component's elements.
 * For each style object, it processes the appearance, dimensions, and palettes
 * (if defined) using their respective methods. Finally, the accumulated styleUsageMap
 * is logged to the console.
 *
 * @param schema - The Schema object to process.
 */
export function processSchema(schema: Schema): void {
  // Iterate over each component in the schema.
  for (const componentKey in schema.components) {
    const component = schema.components[componentKey];

    // Iterate over each element within the component.
    for (const elementKey in component.elements) {
      const style = component.elements[elementKey];

      // Process appearance if defined.
      if (style.appearance) {
        processAppearance(style.appearance);
      }

      // Process dimensions if defined.
      if (style.dimensions) {
        processDimensions(style.dimensions);
      }

      // Process palettes if defined.
      if (style.palettes) {
        // The palettes property is a record of Palettes.
        Object.values(style.palettes).forEach((palette) => {
          processPalettes(palette);
        });
      }
    }
  }

  // Log the final style usage map.
  console.log(styleUsageMap);
}

processSchema(schema);
