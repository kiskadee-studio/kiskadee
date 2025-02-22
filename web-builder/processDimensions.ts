import type { Dimensions } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

/**
 * Processes the provided Dimensions object and updates the styleUsageMap with keys
 * representing each dimension property and its corresponding value.
 *
 * Key formats:
 * - Direct numeric value:         property__value
 * - First-level size (variant):   property--size__value
 * - Responsive breakpoint override: property--size::breakpoint__value
 *
 * In the Dimensions object:
 * - A direct number for a property means its value is stored directly.
 * - A first-level object uses keys (size) whose values (sizeValue) may be either a number or,
 *   if an object, a set of overrides for specific responsive breakpoints.
 *   In the override object, each key (now named breakpoint) is used with its corresponding value.
 *
 * @param dimensions - The Dimensions object containing style properties.
 */
export function processDimensions(dimensions: Dimensions) {
  // Iterate over each property in the Dimensions object.
  for (const [prop, value] of Object.entries(dimensions)) {
    // When the value is a direct number, process it accordingly.
    if (typeof value === 'number') {
      const keyValue = `${prop}__${value}`;
      styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
    }
    // Otherwise, the property value is an object representing sizes.
    else if (typeof value === 'object' && value !== null) {
      // Iterate over each size present (e.g. sm, md, lg).
      for (const [size, sizeValue] of Object.entries(value)) {
        // If the size value is a number, it means this is a direct value for that size.
        if (typeof sizeValue === 'number') {
          // Format: property--size__value
          const keyValue = `${prop}--${size}__${sizeValue}`;
          styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
        }
        // If the size value is an object, then it contains responsive breakpoint overrides.
        else if (typeof sizeValue === 'object' && sizeValue !== null) {
          // Process each responsive breakpoint override.
          for (const [breakpoint, innerVal] of Object.entries(sizeValue)) {
            // Format: property--size::breakpoint__value
            const keyValue = `${prop}--${size}::${breakpoint}__${innerVal}`;
            styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
          }
        }
      }
    }
  }
}
