import type {
  ComponentName,
  ComponentStyleKeyMap,
  Schema,
  StyleKeyByElement
} from '@kiskadee/schema';
import { convertElementDecorationsToStyleKeys } from './decoration/convertElementDecorationsToStyleKeys';
import { convertElementColorsToStyleKeys } from './colors/convertElementColorsToStyleKeys';
import { convertElementScalesToStyleKeys } from './scales/convertElementScalesToStyleKeys';
import { convertElementShadowToStyleKeys } from './effects/convertElementShadowToStyleKeys';
import { deepUpdate } from '../utils';

/**
 * Processes a Schema object by iterating over each component's elements.
 * For each style object, it processes the decoration, scales, and colors
 * (if defined) using their respective methods, and accumulates results
 * into styleKeysByComponent. Finally, the accumulated styleUsageMap
 * is logged to the console.
 *
 * @param schema - The Schema object to process.
 */
export function convertElementSchemaToStyleKeys(schema: Schema): ComponentStyleKeyMap {
  const styleKeysByComponent: ComponentStyleKeyMap = {};

  // Iterate over each component in the schema.
  for (const c in schema.components) {
    const componentName = c as ComponentName;
    const component = schema.components[componentName];
    if (!component?.elements) continue;

    // Iterate over each element within the component.
    for (const elementName in component.elements) {
      const element = component.elements[elementName];

      deepUpdate<StyleKeyByElement>(styleKeysByComponent, [componentName, elementName], (prev) => {
        const el: Partial<StyleKeyByElement> = prev ? { ...prev } : {};
        if (element.decorations) {
          el.decorations = convertElementDecorationsToStyleKeys(element.decorations);
        }
        if (element.scales) {
          el.scales = convertElementScalesToStyleKeys(element.scales);
        }
        if (element.palettes) {
          el.palettes = convertElementColorsToStyleKeys(element.palettes);
        }
        if (element.effects?.shadow) {
          el.effects = convertElementShadowToStyleKeys(element.effects.shadow);
        }

        return el as StyleKeyByElement;
      });
    }
  }

  console.log({ styleKeysByComponent: JSON.stringify(styleKeysByComponent, null, 2) });

  return styleKeysByComponent;

  // // Log the final style usage map.
  // return Object.fromEntries(
  //   Object.entries(styleKeyUsageMap).sort(([a], [b]) => a.localeCompare(b))
  // );
}
