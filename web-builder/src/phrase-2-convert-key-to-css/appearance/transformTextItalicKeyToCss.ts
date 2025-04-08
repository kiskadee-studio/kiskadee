import { CssFontStyleValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

/**
 * Converts a text italic property key into a CSS class rule.
 *
 * For example, for the key "textItalic__true", it returns:
 *   ".textItalic__true { font-style: italic; }"
 *
 * @param styleKey - The text italic property key to process.
 * @returns A string containing the CSS rule.
 *
 * @throws An error if the key does not start with the expected prefix "textItalic__".
 * @throws An error if the extracted italic value is not supported.
 */
export function transformTextItalicKeyToCss(styleKey: string): string {
  const property = 'textItalic';
  const styleKeyParts = styleKey.split('__');
  const styleProperty = styleKeyParts[0];
  const styleValue = styleKeyParts[1];

  if (styleKeyParts.length !== 2) {
    throw new Error(UNSUPPORTED_VALUE(property, styleValue, styleKey));
  }

  if (styleProperty !== property) {
    throw new Error(UNSUPPORTED_PROPERTY(property, styleKey));
  }

  // Determine the corresponding CSS value based on the text italic value.
  let cssValue: string;
  if (styleValue === 'true') {
    cssValue = CssFontStyleValue.italic;
  } else if (styleValue === 'false') {
    cssValue = CssFontStyleValue.normal;
  } else {
    throw new Error(UNSUPPORTED_VALUE(property, styleValue, styleKey));
  }

  // Return the formatted CSS rule.
  // For example: ".textItalic__true { font-style: italic; }"
  return `.${styleKey} { font-style: ${cssValue}; }`;
}
