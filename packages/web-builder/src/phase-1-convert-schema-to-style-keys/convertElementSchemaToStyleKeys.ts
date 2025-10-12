import type {
  ComponentName,
  ComponentStyleKeyMap,
  Schema,
  StyleKeyByElement
} from '@kiskadee/schema';
import { deepUpdate } from '../utils';
import { convertElementColorsToStyleKeys } from './colors/convertElementColorsToStyleKeys';
import { convertElementDecorationsToStyleKeys } from './decoration/convertElementDecorationsToStyleKeys';
import { convertElementShadowToStyleKeys } from './effects/convertElementShadowToStyleKeys';
import { convertElementBorderRadiusToStyleKeys } from './effects/convertElementBorderRadiusToStyleKeys';
import { convertElementScalesToStyleKeys } from './scales/convertElementScalesToStyleKeys';

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
        // Effects: merge multiple effect maps (shadow, borderRadius, ...)
        // Each converter returns a map of InteractionState -> StyleKey[].
        // We concatenate arrays per state to produce a single `effects` map.
        if (element.effects) {
          const effectsMap: StyleKeyByElement['effects'] = {} as any;
          if (element.effects.shadow) {
            const shadowMap = convertElementShadowToStyleKeys(element.effects.shadow);
            for (const st in shadowMap) {
              const arr = (shadowMap as any)[st] as string[];
              deepUpdate(effectsMap, [st], (prev: string[] = []) => [...prev, ...arr]);
            }
          }
          if ((element.effects as any).borderRadius) {
            const brMap = convertElementBorderRadiusToStyleKeys((element.effects as any).borderRadius);
            for (const st in brMap) {
              const arr = (brMap as any)[st] as string[];
              deepUpdate(effectsMap, [st], (prev: string[] = []) => [...prev, ...arr]);
            }
          }
          if (Object.keys(effectsMap).length > 0) {
            el.effects = effectsMap;
          }
        }

        return el as StyleKeyByElement;
      });
    }
  }

  return styleKeysByComponent;
}
