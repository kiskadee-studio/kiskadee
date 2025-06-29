import type {
  ClassNameMap,
  IntentColor,
  InteractionState,
  PaletteKey,
  Palettes
} from '@kiskadee/schema';
import { updateElementStyleKeyMap } from '../../utils';

/**
 * Generates a ClassNameMap of style keys from a Palettes object for each interaction state.
 *
 * Supports both:
 *  - Direct interaction-state maps (InteractionStateColorMap): if the value has a 'rest' key,
 *    it's treated as single intent under a default 'primary'.
 *  - Intent-based maps (IntentColorMap): iterate each intent (primary, secondary, danger, etc.).
 *
 * Style-key format:
 *  - Rest state:
 *      {property}__[ref::]{JSON-stringified color}
 *  - Other states:
 *      {property}--{state}__[JSON-stringified color][::ref]
 *
 * Presence of a reference (`{ ref: Color }`) is encoded as:
 *  - 'ref::' prefix on rest keys
 *  - '::ref' suffix on non-rest keys
 *
 * @param componentName     Name of the component used to namespace style keys.
 * @param elementName       Name of the element within the component.
 * @param colorPropertyMap  Palettes object defining colors per property, intent, and state.
 * @returns A ClassNameMap mapping component → element → interaction state → array of style keys.
 */

export function convertPalettesToStyleKey(
  componentName: string,
  elementName: string,
  colorPropertyMap: Palettes
): ClassNameMap {
  let elementStyleKeyMap: ClassNameMap = {};

  for (const p in colorPropertyMap) {
    const propertyName = p as PaletteKey;
    const interactionStateOrIntentColor = colorPropertyMap[propertyName];
    if (interactionStateOrIntentColor === undefined) continue;

    const isInteractionState = 'rest' in interactionStateOrIntentColor;
    const intentColorMap = isInteractionState
      ? { primary: interactionStateOrIntentColor }
      : interactionStateOrIntentColor;

    for (const intentColor in intentColorMap) {
      const interactionStateMap = intentColorMap[intentColor as IntentColor];
      for (const i in interactionStateMap) {
        const interactionState = i as InteractionState;
        const colorOrRef = interactionStateMap[interactionState];
        const hasRef = typeof colorOrRef === 'object' && 'ref' in colorOrRef;
        const color = JSON.stringify(hasRef ? colorOrRef?.ref : colorOrRef);

        const styleKey =
          interactionState === 'rest'
            ? `${propertyName}__${hasRef ? 'ref::' : ''}${color}`
            : `${propertyName}--${interactionState}${hasRef ? '::ref' : ''}__${color}`;

        elementStyleKeyMap = updateElementStyleKeyMap(
          elementStyleKeyMap,
          componentName,
          elementName,
          interactionState,
          styleKey
        );
      }
    }
  }

  return elementStyleKeyMap;
}
