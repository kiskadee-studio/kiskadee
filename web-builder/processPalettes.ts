import type { Palettes } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

/**
 * Processes an object of type Palettes and registers the usage of each style property
 * in the style usage map (styleUsageMap).
 *
 * For each property (e.g., bgColor, borderColor, textColor), for each group (e.g., primary, danger)
 * and for each state (e.g., rest, hover), a key is generated with the structure:
 *    {property}__{group}__{state}__{value}
 *
 * If the value is wrapped in an object with a "ref" property,
 * this method uses the value of "ref" to compose the key, prefixing it with "ref::".
 *
 * @param palettes Object containing the palette definitions
 */
export function processPalettes(palettes: Palettes) {
  // Iterate over each palette property (e.g., bgColor, borderColor, etc.)
  for (const paletteProp in palettes) {
    const paletteGroups = palettes[paletteProp];
    // Iterate over each group (e.g., primary, danger, etc.)
    for (const groupKey in paletteGroups) {
      const stateObject = paletteGroups[groupKey];
      // Iterate over each state (e.g., rest, hover, etc.)
      for (const state in stateObject) {
        let value = stateObject[state];
        let valueStr: string;
        // If the value is an object with the "ref" property, use the "ref" value and prefix the string with "ref::"
        if (value !== null && typeof value === 'object' && 'ref' in value) {
          value = value.ref;
          valueStr = 'ref::' + JSON.stringify(value);
        } else {
          // Otherwise, convert the value to a string in a deterministic way
          valueStr = JSON.stringify(value);
        }
        const key = `${paletteProp}__${groupKey}__${state}__${valueStr}`;
        styleUsageMap[key] = (styleUsageMap[key] || 0) + 1;
      }
    }
  }
}
