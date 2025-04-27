import { CssFontStyleValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

const { italic, normal } = CssFontStyleValue;

/**
 * Converts a text italic style key into a corresponding CSS rule.
 *
 * The style key includes both the text italic property and its value, separated by "__".
 * For example, the style key "textItalic__true" generates:
 *   ".textItalic__true { font-style: italic; }"
 *
 * @param styleKey - The combined style key for text italic, including both the property and value (e.g., "textItalic__true").
 * @returns A string representing the generated CSS rule.
 *
 * @throws An error if the key's property component is not exactly "textItalic".
 * @throws An error if the key contains extra segments or an unsupported value.
 */
export function transformTextItalicKeyToCss(styleKey: string): string {
  // Define the expected style key for the text italic property.
  const textItalicProperty = 'textItalic';

  // Split the style key on "__" to separate the property component and its value.
  const styleKeyParts = styleKey.split('__');
  const styleProperty = styleKeyParts[0];
  const styleValue = styleKeyParts[1];

  // If the property component does not match the expected value,
  // throw an error indicating an unsupported property.
  if (styleProperty !== textItalicProperty) {
    throw new Error(UNSUPPORTED_PROPERTY(textItalicProperty, styleKey));
  }

  // If the style key doesn't have exactly one value component, it is formatted incorrectly.
  // Combine any extra segments and report them as an unsupported value.
  if (styleKeyParts.length !== 2) {
    const [, ...invalidValue] = styleKeyParts;
    throw new Error(UNSUPPORTED_VALUE(textItalicProperty, invalidValue.join('__'), styleKey));
  }

  // Determine the corresponding CSS font-style based on the value.
  let cssValue: string;
  if (styleValue === 'true') {
    // "true" indicates that the text style should be italic.
    cssValue = italic;
  } else if (styleValue === 'false') {
    // "false" indicates that the text style should be normal.
    cssValue = normal;
  } else {
    // Any other value is unsupported.
    throw new Error(UNSUPPORTED_VALUE(textItalicProperty, styleValue, styleKey));
  }

  // Return the CSS rule string in the proper format.
  // Example: ".textItalic__true { font-style: italic; }"
  return `.${styleKey} { font-style: ${cssValue}; }`;
}
