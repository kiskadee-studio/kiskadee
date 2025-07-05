import type {
  DecorationSchema,
  ClassNameMap,
  InteractionState,
  SolidColor,
  StyleKeyByElement
} from '@kiskadee/schema';
import { updateElementStyleKeyMap } from '../../utils';

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
 * Converts an element's appearance settings into a map of style keys for each interaction state.
 *
 * Non-shadow properties (boolean, string, number, or array) generate a 'rest' state key:
 *   {property}__{value}
 * (arrays are JSON-stringified).
 *
 * Shadow properties (shadowX, shadowY, shadowBlur, shadowColor) are unified:
 *   - Determines all states present on any shadow property, plus 'rest'.
 *   - For each state, missing values fall back to 'rest', then to defaults
 *     (0 for offsets/blur, [0,0,0,1] for color).
 *   - Generates keys:
 *       rest:     shadow__[x,y,blur,[r,g,b,a]]
 *       non-rest: shadow--{state}__[x,y,blur,[r,g,b,a]]
 */
export function convertElementDecorationToStyleKeys(
  decoration: DecorationSchema
): StyleKeyByElement['decorations'] {
  const styleKeys: StyleKeyByElement['decorations'] = [];

  for (const [property, v] of Object.entries(decoration)) {
    if (property.startsWith('shadow') === false) {
      if (
        typeof v === 'boolean' ||
        typeof v === 'string' ||
        typeof v === 'number' ||
        Array.isArray(v)
      ) {
        const value = Array.isArray(v) ? JSON.stringify(v) : v;
        const styleKey = `${property}__${value}`;
        styleKeys.push(styleKey);
      }
    }
  }

  // CSS handles shadows as a single property despite having multiple attributes (x, y, blur, color).
  // So we need to combine all shadow properties into a unified value for each state.

  const hasShadowProperty =
    'shadowColor' in decoration ||
    'shadowX' in decoration ||
    'shadowY' in decoration ||
    'shadowBlur' in decoration;

  if (hasShadowProperty === true) {
    const { shadowX = {}, shadowY = {}, shadowBlur = {}, shadowColor = {} } = decoration;
    const allStates = new Set<InteractionState>([
      ...Object.keys(shadowX),
      ...Object.keys(shadowY),
      ...Object.keys(shadowBlur),
      ...Object.keys(shadowColor)
    ] as InteractionState[]);
    allStates.add('rest');

    for (const state of allStates) {
      const x = getShadowValue(shadowX, state, 0);
      const y = getShadowValue(shadowY, state, 0);
      const blur = getShadowValue(shadowBlur, state, 0);
      const color: SolidColor = getShadowValue(shadowColor, state, [0, 0, 0, 1]);
      const styleKey =
        state === 'rest'
          ? `shadow__[${x},${y},${blur},${JSON.stringify(color)}]`
          : `shadow--${state}__[${x},${y},${blur},${JSON.stringify(color)}]`;

      // elementStyleKeyMap = updateElementStyleKeyMap(
      //   elementStyleKeyMap,
      //   componentName,
      //   elementName,
      //   state,
      //   styleKey
      // );
      styleKeys.push(styleKey);
    }
  }

  return styleKeys;
}
