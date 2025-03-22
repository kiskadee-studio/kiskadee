import type { Dimensions } from '@kiskadee/schema';
import { styleUsageMap } from '../utils';

/**
 * Processes the provided Dimensions object and updates the styleUsageMap with keys
 * representing each dimension property and its corresponding value.
 *
 * Key formats:
 * - Direct numeric value:         property__value
 * - First-level size:             property--size__value
 * - Responsive breakpoint override:
 *     - If breakpoint is "all": property--size__value  (normalized)
 *     - Otherwise:              property--size::breakpoint__value
 *
 * In the Dimensions object:
 * - A direct number for a property means its value is stored directly.
 * - A first-level object uses keys (size) whose values (sizeValue) may be either a number or,
 *   if an object, a set of responsive overrides for specific breakpoints.
 *   In the override object, each key (now named breakpoint) is used with its corresponding value.
 *
 * @param dimensions - The Dimensions object containing style properties.
 */
export function convertDimensionObjectToKey(dimensions: Dimensions) {
  // Iterate over each property in the Dimensions object.
  for (const [prop, value] of Object.entries(dimensions)) {
    // Process direct numeric value.
    if (typeof value === 'number') {
      const keyValue = `${prop}__${value}`;
      styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
    } else if (typeof value === 'object' && value !== null) {
      // Iterate over each size (e.g., sm, md, lg).
      for (const [size, sizeValue] of Object.entries(value)) {
        // Process first-level size value.
        if (typeof sizeValue === 'number') {
          const keyValue = `${prop}--${size}__${sizeValue}`;
          styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
        } else if (typeof sizeValue === 'object' && sizeValue !== null) {
          // Process responsive breakpoint overrides.
          for (const [breakpoint, innerVal] of Object.entries(sizeValue)) {
            // If breakpoint is "all", normalize the key to first-level size format.
            const keyValue =
              breakpoint === 'all'
                ? `${prop}--${size}__${innerVal}`
                : `${prop}--${size}::${breakpoint}__${innerVal}`;
            styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
          }
        }
      }
    }
  }
}
