import { CssFontStyleValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

/**
 * Converts a text italic property key into a CSS class rule.
 *
 * For example, for the key "textItalic__true", it returns:
 *   ".textItalic__true { font-style: italic; }"
 *
 * @param key - The text italic property key to process.
 * @returns A string containing the CSS rule.
 *
 * @throws An error if the key does not start with the expected prefix "textItalic__".
 * @throws An error if the extracted italic value is not supported.
 */
export function transformTextItalicKeyToCss(key: string): string {
  // Define the expected prefix for the key.
  const property = 'textItalic';
  const prefix = `${property}__`;

  // Verify that the input key starts with the required prefix.
  if (!key.startsWith(prefix)) {
    throw new Error(UNSUPPORTED_PROPERTY(prefix, key));
  }

  // Remove the prefix from the key to extract only the text italic value.
  const textItalicValue = key.substring(prefix.length);

  // Determine the corresponding CSS value based on the text italic value.
  let cssValue: string;
  if (textItalicValue === 'true') {
    cssValue = CssFontStyleValue.italic;
  } else if (textItalicValue === 'false') {
    cssValue = CssFontStyleValue.normal;
  } else {
    throw new Error(UNSUPPORTED_VALUE(property, textItalicValue, key));
  }

  // Return the formatted CSS rule.
  // For example: ".textItalic__true { font-style: italic; }"
  return `.${key} { font-style: ${cssValue}; }`;
}
