import type {
  ClassNameMap,
  SemanticColor,
  InteractionState,
  ColorSchema,
  ColorProperty,
  ComponentName,
  ElementName
} from '@kiskadee/schema';
import { updateElementStyleKeyMap } from '../../utils';

/**
 * Generates a ClassNameMap of style keys from a Palettes object for each interaction state.
 *
 * Supports both:
 *  - Direct interaction‐state maps (`InteractionStateColorMap`):
 *      when the value has a 'rest' key, it's treated as a single semantic color under 'primary'.
 *  - Semantic color maps (`SemanticColorMap`): iterate each semantic color (primary, secondary,
 *      danger, etc.).
 *
 * Style‐key format:
 *  - Rest state:
 *      {property}__[ref::]{JSON-stringified color}
 *  - Other states:
 *      {property}--{state}__[JSON-stringified color][::ref]
 *
 * Presence of a reference (`{ ref: Color }`) is encoded as:
 *  - 'ref::' prefix on rest keys
 *  - '::ref' suffix on non-rest keys
 *
 * @param componentName    Name of the component used to namespace style keys.
 * @param elementName      Name of the element within the component.
 * @param colorPropertyMap Palettes object defining colors per property, semantic color, and state.
 * @returns A ClassNameMap mapping component → element → interaction state → style keys array.
 */

export function convertColorsToStyleKeys(
  componentName: ComponentName,
  elementName: ElementName,
  colorPropertyMap: ColorSchema
): ClassNameMap {
  let elementStyleKeyMap: ClassNameMap = {};

  for (const p in colorPropertyMap) {
    const propertyName = p as ColorProperty;
    const colorEntry = colorPropertyMap[propertyName];
    if (colorEntry === undefined) continue;

    const isInteractionState = 'rest' in colorEntry;
    const semanticColorMap = isInteractionState ? { primary: colorEntry } : colorEntry;

    for (const semanticColor in semanticColorMap) {
      const interactionStateMap = semanticColorMap[semanticColor as SemanticColor];
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
