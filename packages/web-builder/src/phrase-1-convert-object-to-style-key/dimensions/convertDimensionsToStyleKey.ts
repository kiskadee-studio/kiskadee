import type { Dimensions, SizeProps } from '@kiskadee/schema';
import { styleUsageMap } from '../../utils';
import { sizeProps } from '@kiskadee/schema';

/**
 * Processes the provided Dimensions object and updates the styleUsageMap with keys
 * representing each dimension property and its corresponding value.
 *
 * Key formats:
 * - Direct numeric value: property__value
 * - First-level size:
 *     - If the size token is in sizeProps and its value is a number,
 *       the size token is ignored and the key is: property__value.
 *     - Otherwise: property--size__value
 * - Responsive breakpoint override (nested object):
 *     - If the size key is in sizeProps and the breakpoint key is "bp:all",
 *       the size token is omitted, and the key becomes: property__value.
 *     - Otherwise, include the size token and breakpoint in the key as: property--size::breakpoint__value
 *
 * In the Dimensions object:
 * - A direct number for a property means its value is stored directly.
 * - A first-level object uses keys (size) whose values (sizeValue) may be either a number or,
 *   if an object, a set of responsive overrides for specific breakpoints.
 *   In the override object, each key (now named breakpoint) is used with its corresponding value.
 *
 * @param dimensions - The Dimensions object containing style properties.
 */
export function convertDimensionsToStyleKey(dimensions: Dimensions) {
  // Iterate over each property in the Dimensions object.
  for (const [prop, value] of Object.entries(dimensions)) {
    // Process direct numeric value.
    if (typeof value === 'number') {
      const keyValue = `${prop}__${value}`;
      styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
    } else if (typeof value === 'object' && value !== null) {
      // Iterate over each size (e.g., "s:sm:1", "s:md:1", etc.).
      for (const [size, sizeValue] of Object.entries(value)) {
        // Process first-level size value.
        if (typeof sizeValue === 'number') {
          // When the size token is in sizeProps, ignore it in the key.
          const keyValue = sizeProps.includes(size as SizeProps)
            ? `${prop}__${sizeValue}`
            : `${prop}--${size}__${sizeValue}`;
          styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
        } else if (typeof sizeValue === 'object' && sizeValue !== null) {
          // Process responsive breakpoint overrides.
          for (const [breakpoint, innerVal] of Object.entries(sizeValue)) {
            let keyValue: string;
            // For any size token in sizeProps with "bp:all", omit the size token.
            if (sizeProps.includes(size as SizeProps) && breakpoint === 'bp:all') {
              keyValue = `${prop}__${innerVal}`;
            } else {
              keyValue = `${prop}--${size}::${breakpoint}__${innerVal}`;
            }
            styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
          }
        }
      }
    }
  }
}
