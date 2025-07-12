import type {
  ComponentName,
  ComponentStyleKeyMap,
  Schema,
  StyleKeyByElement
} from '@kiskadee/schema';
import { convertElementDecorationsToStyleKeys } from './decoration/convertElementDecorationsToStyleKeys';
import { convertElementColorsToStyleKeys } from './colors/convertElementColorsToStyleKeys';
import { styleKeyUsageMap } from '../utils';
import { convertElementScalesToStyleKeys } from './scales/convertElementScalesToStyleKeys';
import { update } from 'lodash';
import { convertElementShadowToStyleKeys } from './effects/convertElementShadowToStyleKeys';

/**
 * Processes a Schema object by iterating over each component's elements.
 * For each style object, it processes the decoration, scales, and colors
 * (if defined) using their respective methods, and accumulates results
 * into styleKeysByComponent. Finally, the accumulated styleUsageMap
 * is logged to the console.
 *
 * @param schema - The Schema object to process.
 */
export function convertSchemaToStyleKeyList(schema: Schema): ComponentStyleKeyMap {
  const styleKeysByComponent: ComponentStyleKeyMap = {};

  // Iterate over each component in the schema.
  for (const c in schema.components) {
    const componentName = c as ComponentName;
    const component = schema.components[componentName];
    if (!component?.elements) continue;

    // Iterate over each element within the component.
    for (const elementName in component.elements) {
      const element = component.elements[elementName];

      update(styleKeysByComponent, [componentName, elementName], (el: StyleKeyByElement) => {
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
        return el;
      });
    }
  }

  console.log({ styleKeysByComponent });

  return styleKeysByComponent;

  // // Log the final style usage map.
  // return Object.fromEntries(
  //   Object.entries(styleKeyUsageMap).sort(([a], [b]) => a.localeCompare(b))
  // );
}
