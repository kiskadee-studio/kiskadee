import { CssTextWeightProperty, type TextWeightValue } from '@kiskadee/schema';
import { INVALID_KEY_PREFIX, UNSUPPORTED_VALUE } from '../errorMessages';

/**
 * Converts a text weight property key into a corresponding CSS rule.
 *
 * For example, for the key "textWeight__bold", it returns:
 *   ".textWeight__bold { font-weight: 700 }"
 *
 * @param key - The text weight property key to process.
 * @returns A string containing the CSS rule.
 *
 * @throws An error if the key does not start with the expected prefix "textWeight__".
 * @throws An error if the extracted weight value is not supported or does not exist in the CssTextWeightProperty mapping.
 */
export function transformTextWeightKeyToCss(key: string): string {
  // Define the expected prefix for the key.
  const prefix = 'textWeight__';

  // Check if the input key starts with the required prefix.
  // If it doesn't, throw an error indicating that the key has an invalid prefix.
  const invalidKey = !key.startsWith(prefix);
  if (invalidKey === true) {
    throw new Error(INVALID_KEY_PREFIX(prefix, key));
  }

  // Remove the prefix from the key to extract only the weight value.
  const textWeightValue = key.substring(prefix.length);

  // Retrieve the numeric value for the text weight from the CssTextWeightProperty mapping.
  // Casting weightKey to TextWeight for type safety.
  const cssValue = CssTextWeightProperty[textWeightValue as TextWeightValue];

  // If the retrieved font weight value is null or undefined, then this value is unsupported.
  // In such a case, throw an error indicating the unsupported value.
  const invalidCssValue = cssValue == null;
  if (invalidCssValue === true) {
    throw new Error(UNSUPPORTED_VALUE('textWeight', textWeightValue, key));
  }

  // Return the formatted CSS rule using the original key and the corresponding font weight value.
  // For example: ".textWeight__bold { font-weight: 700 }"
  return `.${key} { font-weight: ${cssValue} }`;
}
