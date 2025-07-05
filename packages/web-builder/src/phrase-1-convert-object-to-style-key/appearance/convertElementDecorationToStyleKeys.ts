import type { DecorationSchema, StyleKeyByElement } from '@kiskadee/schema';

/**
 * Generates style key strings from an element's decoration schema.
 *
 * This function does not perform property name or value validation; unit tests guarantee that
 * provided properties and values are valid. Any validation errors will surface in the next phase
 * that converts style keys into CSS rules.
 *
 * Processes all primitive and array values uniformly:
 *   - boolean, string, number, or array entries produce a style key in the format
 *     "{property}__{value}" (arrays are JSON-stringified).
 *
 * @param decoration - The DecorationSchema object defining decoration properties.
 * @returns An array of style key strings corresponding to the decoration.
 */
export function convertElementDecorationToStyleKeys(
  decoration: DecorationSchema
): StyleKeyByElement['decorations'] {
  const styleKeys: StyleKeyByElement['decorations'] = [];

  for (const [property, v] of Object.entries(decoration)) {
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

  return styleKeys;
}
