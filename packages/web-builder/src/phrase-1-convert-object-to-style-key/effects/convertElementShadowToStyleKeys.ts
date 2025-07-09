import type {
  ClassNameMap,
  InteractionState,
  ShadowSchema,
  SolidColor,
  StyleKeyByElement,
  StyleKeysByInteractionState
} from '@kiskadee/schema';
import { updateElementStyleKeyMap } from '../../utils';
import { buildStyleKey } from '../utils/buildStyeKey';
import { update } from 'lodash';

/**
 * Gets a shadow property value for the given interaction state, falling back to 'rest' then to a
 * default.
 */
function getShadowValue<T>(
  property: Partial<Record<InteractionState, T>>,
  state: InteractionState,
  defaultValue: T
): T {
  return property[state] !== undefined
    ? property[state]
    : property.rest !== undefined
      ? property.rest
      : defaultValue;
}

/**
 * Converts an element's shadow settings into a map of style keys for each interaction state.
 *
 * Handles only shadow schema properties (x, y, blur, color):
 *   - Gathers all interaction states present on any of the properties, plus 'rest'.
 *   - For each state, missing values fall back to 'rest', then to defaults
 *     (0 for x/y offsets and blur, [0,0,0,1] for color).
 *   - Produces keys in the format:
 *       shadow--{state}__[x,y,blur,[r,g,b,a]]
 */
export function convertElementShadowToStyleKeys(shadow: ShadowSchema): StyleKeysByInteractionState {
  const styleKeys: StyleKeysByInteractionState = {};

  // CSS treats box-shadow as a single property, so combine x, y, blur, and color for each state.
  const hasShadowProperty = 'color' in shadow || 'blur' in shadow || 'y' in shadow || 'x' in shadow;

  if (hasShadowProperty) {
    const { color = {}, blur = {}, y = {}, x = {} } = shadow;
    const allStates = new Set<InteractionState>([
      ...Object.keys(color),
      ...Object.keys(blur),
      ...Object.keys(y),
      ...Object.keys(x)
    ] as InteractionState[]);
    allStates.add('rest');

    for (const state of allStates) {
      const shadowX = getShadowValue(x, state, 0);
      const shadowY = getShadowValue(y, state, 0);
      const shadowBlur = getShadowValue(blur, state, 0);
      const shadowColor: SolidColor = getShadowValue(color, state, [0, 0, 0, 1]);
      const styleKey = buildStyleKey({
        propertyName: 'shadow',
        interactionState: state,
        value: [shadowX, shadowY, shadowBlur, shadowColor]
      });

      update(styleKeys, state, (arr = []) => [...arr, styleKey]);
    }
  }

  return styleKeys;
}
