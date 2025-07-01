import type { ScaleSchema } from '@kiskadee/schema';
import type { ClassNameMap, ElementSizeValue } from '@kiskadee/schema';
import { updateElementStyleKeyMap } from '../../utils';
import { elementSizeValues } from '@kiskadee/schema';

/**
 * Processes the provided Dimensions object and returns a ClassNameMap
 * with all computed style keys under the 'rest' state.
 *
 * Key formats:
 * - Direct numeric value: property__value
 * - First-level size:
 *     • If the size token is in sizeProps and its value is a number,
 *       the size token is ignored and the key is: property__value.
 *     • Otherwise: property--size__value
 * - Responsive breakpoint override (nested object):
 *     • If the size token is in sizeProps and the breakpoint key is "bp:all",
 *       omit the size token: property__value.
 *     • Otherwise: property--size::breakpoint__value
 *
 * @param componentName - Name of the component to scope the style keys.
 * @param elementName - Name of the element to scope the style keys.
 * @param dimensions - The Dimensions object containing style properties.
 * @returns A ClassNameMap mapping the computed dimension style keys under 'rest'.
 */
export function convertDimensionsToStyleKey(
  componentName: string,
  elementName: string,
  dimensions: ScaleSchema
): ClassNameMap {
  let elementStyleKeyMap: ClassNameMap = {};

  for (const [property, value] of Object.entries(dimensions)) {
    if (typeof value === 'number') {
      const styleKey = `${property}__${value}`;
      elementStyleKeyMap = updateElementStyleKeyMap(
        elementStyleKeyMap,
        componentName,
        elementName,
        'rest',
        styleKey
      );
    } else if (value && typeof value === 'object') {
      for (const [size, sizeValue] of Object.entries(value as Record<string, unknown>)) {
        if (typeof sizeValue === 'number') {
          const styleKey = (elementSizeValues as readonly ElementSizeValue[]).includes(
            size as ElementSizeValue
          )
            ? `${property}__${sizeValue}`
            : `${property}--${size}__${sizeValue}`;
          elementStyleKeyMap = updateElementStyleKeyMap(
            elementStyleKeyMap,
            componentName,
            elementName,
            'rest',
            styleKey
          );
        } else if (sizeValue && typeof sizeValue === 'object') {
          for (const [breakpoint, innerVal] of Object.entries(
            sizeValue as Record<string, number>
          )) {
            const styleKey =
              (elementSizeValues as readonly ElementSizeValue[]).includes(
                size as ElementSizeValue
              ) && breakpoint === 'bp:all'
                ? `${property}__${innerVal}`
                : `${property}--${size}::${breakpoint}__${innerVal}`;
            elementStyleKeyMap = updateElementStyleKeyMap(
              elementStyleKeyMap,
              componentName,
              elementName,
              'rest',
              styleKey
            );
          }
        }
      }
    }
  }

  return elementStyleKeyMap;
}
