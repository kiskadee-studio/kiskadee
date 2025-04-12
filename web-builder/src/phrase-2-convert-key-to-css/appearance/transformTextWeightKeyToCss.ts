import { CssTextWeightValue, type TextWeightValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

/**
 * Converts a text weight property key into a corresponding CSS rule.
 *
 * For example, for the key "textWeight__bold", it returns:
 *   ".textWeight__bold { font-weight: 700 }"
 *
 * @param styleKey - The text weight property key to process.
 * @returns A string containing the CSS rule.
 *
 * @throws An error if the key does not start with the expected prefix "textWeight__".
 * @throws An error if the extracted weight value is not supported or does not exist in the CssTextWeightProperty mapping.
 */
export function transformTextWeightKeyToCss(styleKey: string): string {
  // Define the expected prefix for the key.
  const propertyName = 'textWeight';
  const prefix = `${propertyName}__`;

  // Check if the input key starts with the required prefix.
  // If it doesn't, throw an error indicating that the key has an invalid prefix.
  if (!styleKey.startsWith(prefix)) {
    throw new Error(UNSUPPORTED_PROPERTY(prefix, styleKey));
  }

  // Remove the prefix from the key to extract only the text weight value.
  const textWeightValue = styleKey.substring(prefix.length);

  // Retrieve the corresponding CSS value for the text weight from the mapping.
  const cssValue: CssTextWeightValue | undefined =
    CssTextWeightValue[textWeightValue as TextWeightValue];

  // If the retrieved cssValue is null or undefined, then the value is unsupported.
  // In such a case, throw an error indicating the unsupported text weight value.
  if (cssValue == null) {
    throw new Error(UNSUPPORTED_VALUE(propertyName, textWeightValue, styleKey));
  }

  // Return the formatted CSS rule using the original key and the corresponding CSS value.
  // For example: ".textWeight__bold { font-weight: 700 }"
  return `.${styleKey} { font-weight: ${cssValue} }`;
}
