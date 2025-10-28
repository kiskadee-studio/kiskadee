import type {
  Color,
  ColorProperty,
  ColorValue,
  ElementColors,
  EmphasisVariant,
  InteractionState,
  InteractionStateColorMap,
  PaletteName,
  SelectedInteractionStateToken,
  SelectedInteractionSubMap,
  SemanticColor,
  StyleKey,
  StyleKeyByElement
} from '@kiskadee/schema';
import { buildStyleKey, deepUpdate } from '../../utils';

// Metadata to track which tone (soft/solid) generated each style key
export type ToneMetadata = {
  tone?: EmphasisVariant; // undefined = color without tone (single color)
};

// Local type guards to avoid any
function isRefValue(val: Color | ColorValue): val is { ref: Color } {
  return typeof val === 'object' && val !== null && 'ref' in (val as Record<string, unknown>);
}

function isSelectedSubMap(val: unknown): val is SelectedInteractionSubMap {
  return !!val && typeof val === 'object' && 'rest' in (val as Record<string, unknown>);
}

function isInteractionStateColorMap(val: unknown): val is InteractionStateColorMap {
  return !!val && typeof val === 'object' && 'rest' in (val as Record<string, unknown>);
}

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
 * - Additionally tracks which tone (soft/solid) generated each style key in a parallel Map
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
 * @returns An object with styleKeys and toneMetadata Map tracking tone info for each key.
 */
export function convertElementColorsToStyleKeys(palettes: ElementColors): {
  styleKeys: StyleKeyByElement['palettes'];
  toneMetadata: Map<StyleKey, ToneMetadata>;
} {
  const styleKeys: StyleKeyByElement['palettes'] = {};
  const toneMetadata = new Map<StyleKey, ToneMetadata>();

  for (const p in palettes) {
    const paletteName = p as PaletteName;
    const colorSchema = palettes[paletteName];

    for (const c in colorSchema) {
      const colorProperty = c as ColorProperty;
      const colorEntry = colorSchema[colorProperty];
      if (colorEntry === undefined) continue;

      // The new schema requires emphasis tracks (soft/solid) under each semantic color.
      // Reject legacy direct InteractionStateColorMap at the property root.
      if (isInteractionStateColorMap(colorEntry)) {
        throw new Error(
          'Invalid color schema: direct interaction-state maps are no longer supported. Use soft/solid tracks under each semantic color.'
        );
      }
      type SemanticEntry = Record<EmphasisVariant, InteractionStateColorMap> | unknown;
      const semanticColorMap: Partial<Record<SemanticColor, SemanticEntry>> = colorEntry as Partial<
        Record<SemanticColor, SemanticEntry>
      >;

      // Helper that processes a plain interaction-state map (rest/hover/pressed/focus/selected)
      const processInteractionStateMap = (
        semanticColor: SemanticColor,
        interactionStateMap: InteractionStateColorMap,
        tone?: EmphasisVariant
      ) => {
        const keys: (keyof InteractionStateColorMap)[] = [
          'rest',
          'hover',
          'pressed',
          'focus',
          'selected',
          'disabled',
          'readOnly'
        ];
        for (const interactionState of keys) {
          const rawValue = interactionStateMap[interactionState as keyof InteractionStateColorMap];
          if (rawValue === undefined) continue;

          // Handle the enriched "selected" submap shape: { rest, hover?, pressed?, focus? }.
          if (interactionState === 'selected' && isSelectedSubMap(rawValue)) {
            const sub = rawValue as SelectedInteractionSubMap;

            // Helper to push a key under a given state label
            const push = (
              stateLabel: InteractionState | SelectedInteractionStateToken,
              val: ColorValue | Color
            ) => {
              const isRef = isRefValue(val);
              const color = JSON.stringify(isRef ? val.ref : (val as Color));

              // For the selected scope, we pass controlState=true and the base interaction (rest/hover/pressed/focus)
              if (stateLabel.startsWith('selected:')) {
                const baseInteraction = stateLabel.split(':')[1] as InteractionState; // 'rest' | 'hover' | 'pressed' | 'focus'
                const styleKey = buildStyleKey({
                  propertyName: colorProperty,
                  controlState: true,
                  interactionState: baseInteraction,
                  isRef,
                  value: color
                });
                deepUpdate(
                  styleKeys,
                  [paletteName, semanticColor, stateLabel],
                  (arr: string[] = []) => [...arr, styleKey]
                );
                // Store tone metadata
                if (tone !== undefined) {
                  toneMetadata.set(styleKey, { tone });
                }
              } else {
                const styleKey = buildStyleKey({
                  propertyName: colorProperty,
                  interactionState: stateLabel as InteractionState,
                  isRef,
                  value: color
                });
                deepUpdate(
                  styleKeys,
                  [paletteName, semanticColor, stateLabel],
                  (arr: string[] = []) => [...arr, styleKey]
                );
                // Store tone metadata
                if (tone !== undefined) {
                  toneMetadata.set(styleKey, { tone });
                }
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
          const val = rawValue as ColorValue | Color;
          const isRef = isRefValue(val);
          const color = JSON.stringify(isRef ? val.ref : (val as Color));

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

          // Store tone metadata for this style key
          if (tone !== undefined) {
            toneMetadata.set(styleKey, { tone });
          }
        }
      };

      for (const s in semanticColorMap) {
        const semanticColor = s as SemanticColor;
        const entry = semanticColorMap[semanticColor];

        // Support tone tracks (soft/solid) as an intermediate level under the semantic color.
        const hasSoftOrSolid =
          entry && typeof entry === 'object' && ('soft' in entry || 'solid' in entry);
        if (hasSoftOrSolid) {
          const tracks = ['soft', 'solid'] as const;
          for (const t of tracks) {
            const trackEntry = (entry as Record<'soft' | 'solid', unknown>)[t];
            if (isInteractionStateColorMap(trackEntry)) {
              processInteractionStateMap(semanticColor, trackEntry, t);
            }
          }
          continue;
        }

        // Fallback: legacy shape (direct interaction-state map under a semantic color) is no longer supported
        if (isInteractionStateColorMap(entry)) {
          throw new Error(
            `Invalid color schema: semantic color "${semanticColor}" must define soft/solid tracks.`
          );
        }
      }
    }
  }

  return { styleKeys, toneMetadata };
}
