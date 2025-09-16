import { CssDecorationProperty } from '@kiskadee/schema';
import { SEPARATORS } from '../../../utils';
import { UNSUPPORTED_PROPERTY_NAME, UNSUPPORTED_VALUE } from '../../errorMessages';

/**
 * Builds a CSS rule that sets the font-family from a style key.
 *
 * Expected key format:
 *   textFont__["Font A","Font B",...]
 * where the value part is a JSON-encoded array of strings.
 */
export function transformTextFontKeyToCss(styleKey: string, className: string): string {
  const propertyName = 'textFont';

  const [parsedProperty, valueKey, ...extraSegments] = styleKey.split(SEPARATORS.VALUE);

  if (parsedProperty !== propertyName) {
    throw new Error(UNSUPPORTED_PROPERTY_NAME(propertyName, styleKey));
  }

  // Must have exactly one value segment and no extras
  const hasExtraSegments = valueKey !== undefined && extraSegments.length > 0;
  if (valueKey === undefined || hasExtraSegments) {
    const invalidValueForError =
      valueKey === undefined ? '' : [valueKey, ...extraSegments].join(SEPARATORS.VALUE);
    throw new Error(UNSUPPORTED_VALUE(propertyName, invalidValueForError, styleKey));
  }

  let families: unknown;
  try {
    families = JSON.parse(valueKey);
  } catch {
    throw new Error(UNSUPPORTED_VALUE(propertyName, valueKey, styleKey));
  }

  if (
    !Array.isArray(families) ||
    families.length === 0 ||
    families.some((f) => typeof f !== 'string')
  ) {
    throw new Error(UNSUPPORTED_VALUE(propertyName, valueKey, styleKey));
  }

  // Decide whether a font family must be quoted. We quote names containing spaces or characters
  // outside of [A-Za-z0-9-]. Generic families like serif, sans-serif stay unquoted.
  const needsQuotes = (name: string): boolean => /[^A-Za-z0-9-]/.test(name);
  const escapeQuotes = (name: string): string => name.replace(/"/g, '\\"');

  const cssFamilies = (families as string[])
    .map((name) => (needsQuotes(name) ? `"${escapeQuotes(name)}"` : name))
    .join(', ');

  const cssProperty = CssDecorationProperty.textFont; // 'font-family'
  return `.${className} { ${cssProperty}: ${cssFamilies} }`;
}
