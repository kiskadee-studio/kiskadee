import { type TextAlignValue, CssTextAlignValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY_NAME, UNSUPPORTED_VALUE } from '../errorMessages';
import type { GeneratedCss } from '../phrase2.types';

/**
 * Converts a text alignment property key into a corresponding CSS class rule object.
 *
 * For example, for the key "textAlign__center", it returns:
 * {
 *   className: "textAlign__center",
 *   cssRule: ".textAlign__center { text-align: center; }"
 * }
 *
 * @param styleKey - The text alignment property key to process.
 * @returns {GeneratedCss} An object containing:
 *   - className: the CSS class name (without the leading dot).
 *   - cssRule: the full CSS rule string (selector + declaration).
 *
 * @throws Error if the key does not start with the expected prefix "textAlign__".
 * @throws Error if the extracted alignment value is not supported.
 */
export function transformTextAlignKeyToCss(styleKey: string): GeneratedCss {
  const propertyName = 'textAlign';
  const prefix = `${propertyName}__`;

  if (!styleKey.startsWith(prefix)) {
    throw new Error(UNSUPPORTED_PROPERTY_NAME(propertyName, styleKey));
  }

  const textAlignValue = styleKey.substring(prefix.length);
  const cssValue: CssTextAlignValue | undefined =
    CssTextAlignValue[textAlignValue as TextAlignValue];

  if (!cssValue) {
    throw new Error(UNSUPPORTED_VALUE(propertyName, textAlignValue, styleKey));
  }

  const cssRule = `.${styleKey} { text-align: ${cssValue}; }`;
  return { className: styleKey, cssRule };
}
