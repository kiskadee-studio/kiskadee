import { type TextAlignValue, textAlign, CssTextAlignValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

/**
 * Converts a text alignment property key into a corresponding CSS class rule.
 * For example, for the key "textAlign__center", it returns:
 *   ".textAlign__center { text-align: center; }"
 *
 * @param styleKey - The text alignment property key to process.
 * @returns A string containing the CSS rule.
 *
 * @throws An error if the key does not start with the expected prefix "textAlign__".
 * @throws An error if the extracted alignment value is not supported.
 */
export function convertTextAlign(styleKey: string): string {
  const propertyName = 'textAlign';
  const prefix = `${propertyName}__`;

  // Check if the input key starts with the required prefix.
  if (!styleKey.startsWith(prefix)) {
    throw new Error(UNSUPPORTED_PROPERTY(propertyName, styleKey));
  }

  // Extract the alignment value by removing the prefix.
  const textAlignValue = styleKey.substring(prefix.length);
  const cssValue: CssTextAlignValue | undefined =
    CssTextAlignValue[textAlignValue as TextAlignValue];

  if (!cssValue) {
    throw new Error(UNSUPPORTED_VALUE(propertyName, textAlignValue, styleKey));
  }

  // Return the formatted CSS rule.
  return `.${styleKey} { text-align: ${cssValue}; }`;
}
