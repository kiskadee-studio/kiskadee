import type { BreakpointValue, ScaleSchema, StyleKeyByElement } from '@kiskadee/schema';
import type { ClassNameMap, ElementSizeValue } from '@kiskadee/schema';
import { updateElementStyleKeyMap } from '../../utils';
import { elementSizeValues } from '@kiskadee/schema';
import { buildStyleKey } from '../utils/buildStyeKey';
import { update } from 'lodash';

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
export function convertDimensionsToStyleKey(dimensions: ScaleSchema): StyleKeyByElement['scales'] {
  const styleKeys: StyleKeyByElement['scales'] = {};

  for (const [propertyName, propertyValue] of Object.entries(dimensions)) {
    if (typeof propertyValue === 'number') {
      const styleKey = buildStyleKey({
        propertyName,
        value: propertyValue
      });
      update(styleKeys, ['s:all'], (arr: string[] = []) => [...arr, styleKey]);
    } else if (propertyValue && typeof propertyValue === 'object') {
      for (const [s, sizeValue] of Object.entries(propertyValue as Record<string, unknown>)) {
        const size = s as ElementSizeValue;
        if (typeof sizeValue === 'number') {
          const styleKey = buildStyleKey({
            propertyName,
            value: sizeValue
          });
          update(styleKeys, [size], (arr: string[] = []) => [...arr, styleKey]);
        } else if (sizeValue && typeof sizeValue === 'object') {
          for (const [b, value] of Object.entries(sizeValue as Record<string, number>)) {
            const breakpoint = b as BreakpointValue;
            const styleKey =
              (elementSizeValues as readonly ElementSizeValue[]).includes(size) &&
              breakpoint === 'bp:all'
                ? buildStyleKey({
                    propertyName,
                    value
                  })
                : buildStyleKey({
                    propertyName,
                    size,
                    value,
                    breakpoint
                  });

            update(styleKeys, [size, breakpoint], (arr: string[] = []) => [...arr, styleKey]);
          }
        }
      }
    }
  }

  return styleKeys;
}
