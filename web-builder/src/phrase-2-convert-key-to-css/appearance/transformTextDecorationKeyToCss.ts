import { type TextDecorationValue, CssTextDecorationValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

/**
 * Converts a text-decoration key into a corresponding CSS rule.
 *
 * The key should be in the format "textDecoration__value", where "value" is one of the allowed values
 * defined in the CssTextDecorationProperty enum.
 *
 * Example: For the key "textDecoration__underline", the function returns:
 *   ".textDecoration__underline { text-decoration: underline; }"
 *
 * If the key does not follow the expected pattern or contains an unsupported value, an error is thrown.
 *
 * @param styleKey - The text-decoration key (e.g., "textDecoration__underline").
 * @returns The corresponding CSS rule.
 *
 * @throws Error if the property is not "textDecoration" or if the value is invalid or if the format is incorrect.
 */
export function transformTextDecorationKeyToCss(styleKey: string): string {
  const propertyName = 'textDecoration';

  // Split the key using the "__" delimiter.
  const styleParts = styleKey.split('__');
  const styleProperty = styleParts[0];
  const styleValue = styleParts[1];

  // Validate that the property component matches the expected value.
  if (styleProperty !== propertyName) {
    throw new Error(UNSUPPORTED_PROPERTY(propertyName, styleKey));
  }

  // The key should contain exactly two parts; otherwise, treat it as an invalid value.
  if (styleParts.length !== 2) {
    const [, ...invalidValue] = styleParts;
    throw new Error(UNSUPPORTED_VALUE(propertyName, invalidValue.join('__'), styleKey));
  }

  const cssValue: CssTextDecorationValue | undefined =
    CssTextDecorationValue[styleValue as TextDecorationValue];

  if (cssValue == null) {
    throw new Error(UNSUPPORTED_VALUE(propertyName, styleValue, styleKey));
  }

  // Return the formatted CSS rule.
  return `.${styleKey} { text-decoration: ${cssValue}; }`;
}
