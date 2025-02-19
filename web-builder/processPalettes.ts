import type { Palettes } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

/**
 * Processes an object of type Palettes and registers the usage of each style property
 * in the style usage map (styleUsageMap).
 *
 * For each palette property (e.g., bgColor, borderColor, textColor), if the value is defined
 * as a FullColor (which has a defined "rest" at its top level) then the keys generated are:
 *    {property}__{value}  (if state is "rest")
 * or
 *    {property}__{state}__{value} (for other interaction states)
 *
 * If the palette property is defined as Variants (e.g. with keys like primary, secondary, etc.),
 * each variant's FullColor is processed but the variant key is omitted from the final key.
 *
 * In addition, if the value is wrapped in an object with a "ref" property, the string "ref::"
 * is prefixed before the JSON string of the value.
 *
 * @param palettes Object containing the palette definitions
 */
export function processPalettes(palettes: Palettes) {
  // Iterate over each palette property (e.g., bgColor, borderColor, textColor)
  for (const paletteProp in palettes) {
    const paletteValue = palettes[paletteProp];
    if (!paletteValue) continue;
    // Determine whether the entry is a FullColor (has "rest" key) or Variants.
    const isFullColor = 'rest' in paletteValue;
    // If FullColor, wrap it into a pseudo group for uniformity.
    const groups = isFullColor ? { default: paletteValue } : paletteValue;
    // Process each group (if variants, group keys such as "primary" are ignored)
    for (const _group in groups) {
      const stateObject = groups[_group];
      // Iterate over each state (e.g., rest, hover, etc.)
      for (const state in stateObject) {
        let value = stateObject[state];
        let valueStr: string;
        // If the value is an object with a "ref" property, get the ref value and prefix accordingly
        if (value !== null && typeof value === 'object' && 'ref' in value) {
          value = value.ref;
          valueStr = 'ref::' + JSON.stringify(value);
        } else {
          valueStr = JSON.stringify(value);
        }
        // For "rest", do not include the state in the key.
        const key =
          state === 'rest'
            ? `${paletteProp}__${valueStr}`
            : `${paletteProp}__${state}__${valueStr}`;
        styleUsageMap[key] = (styleUsageMap[key] || 0) + 1;
      }
    }
  }
}
