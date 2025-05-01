import { CssBorderStyleValue, type BorderStyleValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

/**
 * Converts a border style property key into a corresponding CSS rule.
 *
 * For example, for the key "borderStyle__dashed", it returns:
 *   ".borderStyle__dashed { border-style: dashed }"
 *
 * @param key - The border style property key to process.
 * @returns A string containing the CSS rule.
 *
 * @throws An error if the key does not start with the expected prefix "borderStyle__".
 * @throws An error if the extracted border style value is not supported or does not exist in the CssBorderStyleProperty mapping.
 */
export function transformBorderStyleToCss(key: string): string {
  // Define the expected prefix for the key.
  const prefix = 'borderStyle3__';

  // Check if the input key starts with the required prefix.
  // If it doesn't, throw an error indicating that the key has an invalid prefix.
  if (!key.startsWith(prefix)) {
    throw new Error(UNSUPPORTED_PROPERTY(prefix, key));
  }

  // Remove the prefix from the key to extract only the border style value.
  const borderStyleValue = key.substring(prefix.length);

  // Retrieve the corresponding CSS value for the border style from the mapping.
  const cssValue: CssBorderStyleValue | undefined =
    CssBorderStyleValue[borderStyleValue as BorderStyleValue];

  // If the retrieved cssValue is null or undefined, then the value is unsupported.
  // In such a case, throw an error indicating the unsupported border style value.
  if (cssValue == null) {
    throw new Error(UNSUPPORTED_VALUE('borderStyle', borderStyleValue, key));
  }

  // Return the formatted CSS rule using the original key and the corresponding CSS value.
  // For example: ".borderStyle__dashed { border-style: dashed }"
  return `.${key} { border-style: ${cssValue} }`;
}
