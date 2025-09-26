import type {
  ColorProperty,
  ElementColors,
  InteractionState,
  PaletteName,
  SemanticColor,
  StyleKeyByElement
} from '@kiskadee/schema';
import { buildStyleKey, deepUpdate } from '../../utils';

/**
 * Converts an element's color palettes schema into nested style keys.
 *
 * High-level behavior:
 * - Iterates over palettes (p1, p2, ...).
 * - For each color property (textColor, borderColor, boxColor, ...), handles:
 *   - a direct InteractionStateColorMap (object with "rest" key) OR
 *   - a map of semantic colors (primary, secondary, danger, ...)
 * - For every interaction state found (rest, hover, focus, ...), it:
 *   - Detects whether the color entry is a direct value or a { ref: ... } reference.
 *   - Serializes the color as a string before passing to buildStyleKey:
 *       - When isRef is true, the underlying referenced color is stringified.
 *       - When isRef is false, the direct color value is stringified.
 *   - Uses buildStyleKey to encode propertyName, state, isRef, and serialized value
 *     into a stable StyleKey (e.g., "textColor--rest__[0,0,0,1]" or
 *     "textColor==hover__[0,0,0,0.5]").
 * - Appends the generated key to a nested output structure organized by:
 *     paletteName -> semanticColor -> interactionState -> StyleKey[]
 *
 * Why pre-stringify color values:
 * - buildStyleKey stringifies primitives via String(value) and JSON-serializes non-primitives.
 * - Colors here are arrays (e.g., [h, s, l, a]) or references to arrays. By explicitly
 *   JSON.stringify-ing these values into a string, we guarantee a predictable output
 *   like "[0,0,0,1]" at the end of the key (after "__").
 *
 * Notes:
 * - This function only produces style keys; it does not validate color formats or states.
 *   Validation and error handling occur when transforming keys into CSS in a later phase.
 *
 * @param palettes - The ElementColors object defining element palettes per element.
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

      // If the entry has a "rest" key, it is a direct InteractionStateColorMap
      // (no semantic colors). Otherwise, treat it as a semantic color map.
      const isInteractionState = 'rest' in colorEntry;
      const semanticColorMap = isInteractionState ? { neutral: colorEntry } : colorEntry;

      for (const s in semanticColorMap) {
        const semanticColor = s as SemanticColor;
        const interactionStateMap = semanticColorMap[semanticColor];

        // Each interaction state (rest, hover, focus, ...) maps to either a direct color value
        // or a reference object with a "ref" key.
        for (const i in interactionStateMap) {
          const interactionState = i as InteractionState;
          const rawValue = (interactionStateMap as any)[interactionState];

          // Handle the enriched "selected" submap shape: { rest, hover?, pressed?, focus? }.
          if (interactionState === 'selected' && rawValue && typeof rawValue === 'object' && 'rest' in rawValue) {
            const sub = rawValue as { rest: unknown; hover?: unknown; pressed?: unknown; focus?: unknown };

            // Helper to push a key under a given state label
            const push = (
              stateLabel: InteractionState | 'selected:rest' | 'selected:hover' | 'selected:pressed' | 'selected:focus',
              val: unknown
            ) => {
              const isRef = typeof val === 'object' && val !== null && 'ref' in (val as any);
              const color = JSON.stringify(isRef ? (val as any).ref : val);

              // For selected scope, we pass controlState=true and the base interaction (rest/hover/pressed/focus)
              if (stateLabel.startsWith('selected:')) {
                const baseInteraction = stateLabel.split(':')[1] as InteractionState; // 'rest' | 'hover' | 'pressed' | 'focus'
                const styleKey = buildStyleKey({
                  propertyName: colorProperty,
                  controlState: true,
                  interactionState: baseInteraction,
                  isRef,
                  value: color
                });
                deepUpdate(styleKeys, [paletteName, semanticColor, stateLabel as any], (arr: string[] = []) => [
                  ...arr,
                  styleKey
                ]);
              } else {
                const styleKey = buildStyleKey({
                  propertyName: colorProperty,
                  interactionState: stateLabel as InteractionState,
                  isRef,
                  value: color
                });
                deepUpdate(styleKeys, [paletteName, semanticColor, stateLabel as any], (arr: string[] = []) => [
                  ...arr,
                  styleKey
                ]);
              }
            };

            // selected/rest
            push('selected:rest', sub.rest);
            // selected/hover
            if (sub.hover !== undefined) push('selected:hover', sub.hover);
            // selected/pressed
            if (sub.pressed !== undefined) push('selected:pressed', sub.pressed);
            // selected/focus
            if (sub.focus !== undefined) push('selected:focus', sub.focus);

            continue;
          }

          // A reference has the shape { ref: <color> }. We pass isRef accordingly and serialize
          // the "inner" color when a ref is present.
          const isRef = typeof rawValue === 'object' && rawValue !== null && 'ref' in (rawValue as any);
          const color = JSON.stringify(isRef ? (rawValue as any).ref : rawValue);

          // Build the style key including the interaction state and whether this is a ref.
          // Examples:
          //   - Non-ref: textColor--rest__[0,0,0,1]
          //   - Ref:     textColor==hover__[0,0,0,0.5]
          const styleKey = buildStyleKey({
            propertyName: colorProperty,
            interactionState: interactionState,
            isRef,
            value: color
          });

          // Insert the key in a nested structure:
          //   styleKeys[paletteName][semanticColor][interactionState] = [...StyleKey[]]
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
