import type { CssFontStyleValue, TextItalicKeyToken } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY_NAME, UNSUPPORTED_VALUE } from '../errorMessages';
import type { GeneratedCss } from '../phrase2.types';

/**
 * Converts a text italic style key into a GeneratedCss object.
 *
 * The style key includes both the text italic property and its value, separated by "__".
 *
 * @example
 * ```ts
 * const result = transformTextItalicKeyToCss("textItalic__true");
 * // result:
 * // {
 * //   className: "textItalic__true",
 * //   cssRule: ".textItalic__true { font-style: italic; }"
 * // }
 * ```
 *
 * @param styleKey - The combined style key for text italic, including both the property and value (e.g., "textItalic__true").
 * @returns A GeneratedCss object containing:
 *   - `className`: the raw key (no leading dot)
 *   - `cssRule`: the full CSS rule string (selector + declarations)
 *
 * @throws An error if the key's property component is not exactly "textItalic".
 * @throws An error if the key contains extra segments or an unsupported value.
 */
export function transformTextItalicKeyToCss(styleKey: string): GeneratedCss {
  const textItalicProperty = 'textItalic';
  const styleKeyParts = styleKey.split('__');
  const styleProperty = styleKeyParts[0];
  const styleValue: TextItalicKeyToken = styleKeyParts[1] as TextItalicKeyToken;

  if (styleProperty !== textItalicProperty) {
    throw new Error(UNSUPPORTED_PROPERTY_NAME(textItalicProperty, styleKey));
  }

  if (styleKeyParts.length !== 2) {
    const [, ...invalidValue] = styleKeyParts;
    throw new Error(UNSUPPORTED_VALUE(textItalicProperty, invalidValue.join('__'), styleKey));
  }

  let cssValue: CssFontStyleValue;
  if (styleValue === 'true') {
    cssValue = 'italic';
  } else if (styleValue === 'false') {
    cssValue = 'normal';
  } else {
    throw new Error(UNSUPPORTED_VALUE(textItalicProperty, styleValue, styleKey));
  }

  const cssRule = `.${styleKey} { font-style: ${cssValue}; }`;
  return { className: styleKey, cssRule };
}
