import type {
  SemanticColor,
  InteractionState,
  ColorProperty,
  StyleKeyByElement,
  ElementStyle,
  PaletteName
} from '@kiskadee/schema';
import { update } from 'lodash';

/**
 * Generates a nested map of style key strings from a given palettes definition.
 *
 * Each palette contains color properties (e.g., background, text), each either:
 *   - an InteractionStateColorMap (with 'rest', 'hover', etc.)
 *   - a map of semantic colors (primary, secondary, danger, etc.), each mapping to InteractionStateColorMap.
 *
 * For direct interaction‐state maps (those with a 'rest' key), the semantic color is treated as 'neutral'.
 * Otherwise, all defined semantic colors are iterated.
 *
 * For each color property, semantic color, and interaction state, a style key is generated encoding
 * the property, state, and color value.
 *
 * Style key format:
 *   - Rest state:
 *       "{property}__[<optional 'ref::'>]{JSON-stringified color}"
 *   - Other states:
 *       "{property}--{state}[<optional '::ref'>]__{JSON-stringified color}"
 *
 * A color reference (an object with a 'ref' field) is indicated by:
 *   - 'ref::' prefix on rest keys
 *   - '::ref' suffix on non-rest keys
 *
 * @param palettes  Object mapping palette names to color property definitions, each defining
 *                  either an interaction‐state map or a semantic color map.
 * @returns A nested map: paletteName → semanticColor → interactionState → array of style keys.
 */
export function convertColorsToStyleKeys(
  palettes: ElementStyle['palettes']
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
          const hasRef = typeof colorValue === 'object' && 'ref' in colorValue;
          const color = JSON.stringify(hasRef ? colorValue.ref : colorValue);

          const styleKey =
            interactionState === 'rest'
              ? `${colorProperty}__${hasRef ? 'ref::' : ''}${color}`
              : `${colorProperty}--${interactionState}${hasRef ? '::ref' : ''}__${color}`;

          update(
            styleKeys,
            [paletteName, semanticColor, interactionState],
            (arr: string[] = []) => {
              arr.push(styleKey);
              return arr;
            }
          );
        }
      }
    }
  }

  return styleKeys;
}
