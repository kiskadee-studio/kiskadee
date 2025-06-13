import { CssFontStyleValue, CSSTextItalicValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';
import type { GeneratedCss } from '../types';

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
  const styleValue: CSSTextItalicValue = styleKeyParts[1] as CSSTextItalicValue;

  if (styleProperty !== textItalicProperty) {
    throw new Error(UNSUPPORTED_PROPERTY(textItalicProperty, styleKey));
  }

  if (styleKeyParts.length !== 2) {
    const [, ...invalidValue] = styleKeyParts;
    throw new Error(UNSUPPORTED_VALUE(textItalicProperty, invalidValue.join('__'), styleKey));
  }

  let cssValue: CssFontStyleValue;
  if (styleValue === CSSTextItalicValue.true) {
    cssValue = CssFontStyleValue.italic;
  } else if (styleValue === CSSTextItalicValue.false) {
    cssValue = CssFontStyleValue.normal;
  } else {
    throw new Error(UNSUPPORTED_VALUE(textItalicProperty, styleValue, styleKey));
  }

  const cssRule = `.${styleKey} { font-style: ${cssValue}; }`;
  return { className: styleKey, cssRule };
}
