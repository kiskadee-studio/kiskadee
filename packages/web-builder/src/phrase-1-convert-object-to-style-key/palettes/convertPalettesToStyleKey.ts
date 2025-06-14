import type { InteractionState, PaletteKeys, Palettes, VariantKeys } from '@kiskadee/schema';
import { styleUsageMap } from '../../utils';

/**
 * Processes a Palettes object and records the usage of each style property
 * in the styleUsageMap.
 *
 * For each palette property (e.g., bgColor, borderColor, textColor), if the value is defined
 * as FullColor (has the "rest" key), the keys are generated as follows:
 *   {property}__{value} (when the state is "rest")
 * or
 *   {property}--{state}::{ref (if present)}__{value} (for other states)
 *
 * If the palette property is defined as Variants (e.g., with keys like primary, secondary, etc.),
 * each variant's FullColor is processed, but the variant key is omitted in the final key.
 *
 * Additionally, if the value is wrapped in an object with a "ref" property, the "ref"
 * indicator is included in the key pattern.
 *
 * @param palettes Object containing the palette definitions
 */
export function convertPalettesToStyleKey(palettes: Palettes) {
  // Iterate over each palette property (e.g., bgColor, borderColor, textColor)
  for (const paletteProp in palettes) {
    const paletteValue = palettes[paletteProp as PaletteKeys];
    if (!paletteValue) continue;

    // Check if the entry is FullColor (has the "rest" key) or Variants.
    const isFullColor = 'rest' in paletteValue;

    // If the entry is FullColor, wrap it in a pseudo-group for unified processing.
    const variants = isFullColor ? { primary: paletteValue } : paletteValue;

    // Process each group (for variants, the group key is omitted in the final key)
    for (const variant in variants) {
      const states = variants[variant as VariantKeys];

      // Iterate over each state (e.g., rest, hover, etc.)
      for (const _state in states) {
        const state = _state as InteractionState;

        const rawValue = states[state];
        const hasRef = rawValue !== null && typeof rawValue === 'object' && 'ref' in rawValue;

        // If there is a "ref", extract the actual value
        const actualValue = hasRef ? rawValue?.ref : rawValue;
        const jsonValue = JSON.stringify(actualValue);

        let key: string;
        if (state === 'rest') {
          key = `${paletteProp}__${hasRef ? 'ref::' : ''}${jsonValue}`;
        } else {
          key = `${paletteProp}--${state}${hasRef ? '::ref' : ''}__${jsonValue}`;
        }
        styleUsageMap[key] = (styleUsageMap[key] || 0) + 1;
      }
    }
  }
}
