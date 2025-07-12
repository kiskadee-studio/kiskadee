import type {
  SemanticColor,
  InteractionState,
  ColorProperty,
  StyleKeyByElement,
  PaletteName,
  ElementColors
} from '@kiskadee/schema';
import { buildStyleKey, deepUpdate } from '../../utils';

/**
 * Converts an element's color palettes schema into nested style keys.
 *
 * Processes each palette and color property, handling both raw InteractionStateColorMap
 * and semantic color groups, and generates style keys for each interaction state,
 * including reference indicators, via {@link buildStyleKey}.
 *
 * @param palettes - The ElementColors object defining element palettes.
 * @returns A nested map of style keys organized by palette name and property.
 */
export function convertElementColorsToStyleKeys(
  palettes: ElementColors
): StyleKeyByElement['palettes'] {
  const styleKeys: StyleKeyByElement['palettes'] = {};

  for (const p in palettes) {
    const paletteName = p as PaletteName;
    const colorSchema = palettes[paletteName];

    for (const c in colorSchema) {
      const colorProperty = c as ColorProperty;
      const colorEntry = colorSchema[colorProperty];
      if (colorEntry === undefined) continue;

      const isInteractionState = 'rest' in colorEntry;
      const semanticColorMap = isInteractionState ? { neutral: colorEntry } : colorEntry;

      for (const s in semanticColorMap) {
        const semanticColor = s as SemanticColor;
        const interactionStateMap = semanticColorMap[semanticColor];
        for (const i in interactionStateMap) {
          const interactionState = i as InteractionState;
          const colorValue = interactionStateMap[interactionState];
          const isRef = typeof colorValue === 'object' && 'ref' in colorValue;
          const color = JSON.stringify(isRef ? colorValue.ref : colorValue);

          const styleKey = buildStyleKey({
            propertyName: colorProperty,
            interactionState: interactionState,
            isRef,
            value: color
          });

          deepUpdate(
            styleKeys,
            [paletteName, semanticColor, interactionState],
            (arr: string[] = []) => [...arr, styleKey]
          );
        }
      }
    }
  }

  return styleKeys;
}
