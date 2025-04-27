import { CssTextWeightValue, type TextWeightValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

/**
 * Converts a text weight property key into a corresponding CSS rule.
 *
 * For example, for the key "textWeight__bold", it returns:
 *   ".textWeight__bold { font-weight: 700 }"
 *
 * @param styleKey - The text weight property key.
 * @returns A string containing the CSS rule.
 *
 * @throws An error if the key does not start with the expected prefix "textWeight__".
 * @throws An error if the extracted weight value is not supported or does not exist in the CssTextWeightValue mapping.
 */
export function transformTextWeightKeyToCss(styleKey: string): string {
  // Define the expected property name for the style key.
  const propertyName = 'textWeight';
  const prefix = `${propertyName}__`;

  // Check if the input key starts with the required prefix.
  // If it doesn't, throw an error indicating that the property name is invalid.
  if (styleKey.startsWith(prefix) === false) {
    throw new Error(UNSUPPORTED_PROPERTY(propertyName, styleKey));
  }

  // Remove the prefix from the style key to extract the text weight value.
  const textWeightValue = styleKey.substring(prefix.length);

  // Retrieve the corresponding CSS value for the text weight from the mapping.
  const cssValue: CssTextWeightValue | undefined =
    CssTextWeightValue[textWeightValue as TextWeightValue];

  // If the retrieved CSS value is undefined, the text weight is unsupported.
  // Thus, throw an error indicating the unsupported value along with the style key.
  if (cssValue === undefined) {
    throw new Error(UNSUPPORTED_VALUE(propertyName, textWeightValue, styleKey));
  }

  // Return a CSS rule using the property name and its corresponding CSS value.
  // Example: ".textWeight__bold { font-weight: 700 }"
  return `.${styleKey} { font-weight: ${cssValue} }`;
}
