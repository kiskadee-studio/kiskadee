import { CssFontStyleValue } from '@kiskadee/schema';
import { INVALID_KEY_PREFIX, UNSUPPORTED_VALUE, INVALID_KEY_FORMAT } from '../errorMessages';

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
 * @throws An error if the key has an invalid format (for example, if it does not contain exactly one delimiter "__").
 * @throws An error if the extracted italic value is not supported.
 */
export function transformTextItalicKeyToCss(key: string): string {
  // Define the expected prefix for the key.
  const property = 'textItalic';
  const prefix = `${property}__`;

  // Check if the input key starts with the required prefix.
  // If it doesn't, throw an error indicating that the key has an invalid prefix.
  if (!key.startsWith(prefix)) {
    throw new Error(INVALID_KEY_PREFIX(prefix, key));
  }

  // Split the key into parts using the delimiter '__'.
  // We expect exactly 2 parts: the prefix and the italic value.
  const parts = key.split('__');
  if (parts.length !== 2) {
    // Throw an error if the key format is invalid.
    throw new Error(INVALID_KEY_FORMAT(property, key));
  }

  // The second part of the key represents the italic value.
  // It should be either 'true' (for italic styling) or 'false' (for normal styling).
  const italicValue = parts[1];
  let cssValue: string;
  if (italicValue === 'true') {
    cssValue = CssFontStyleValue.italic;
  } else if (italicValue === 'false') {
    cssValue = CssFontStyleValue.normal;
  } else {
    // Throw an error if the value is not recognized.
    throw new Error(UNSUPPORTED_VALUE(property, italicValue, key));
  }

  // Return the formatted CSS rule using the original key and the corresponding CSS value.
  // For example: ".textItalic__true { font-style: italic; }"
  return `.${key} { font-style: ${cssValue}; }`;
}
