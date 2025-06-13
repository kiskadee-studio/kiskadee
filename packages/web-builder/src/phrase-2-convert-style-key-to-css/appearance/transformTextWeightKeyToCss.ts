import { CssTextWeightValue, type TextWeightValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';
import type { GeneratedCss } from '../phrase2.types';

/**
 * Converts a textWeight style key into a GeneratedCss object.
 *
 * The key must be in the format "textWeight__<value>", where <value> is one of the
 * values defined in CssTextWeightValue.
 *
 * @example
 * ```ts
 * const result = transformTextWeightKeyToCss("textWeight__bold");
 * // result:
 * // {
 * //   className: "textWeight__bold",
 * //   cssRule: ".textWeight__bold { font-weight: 700 }"
 * // }
 * ```
 *
 * @param styleKey - The text weight style key (e.g., "textWeight__bold").
 * @returns A GeneratedCss object containing:
 *   - `className`: the raw key (no leading dot)
 *   - `cssRule`: the full CSS rule string (selector + declaration)
 *
 * @throws An error if the key does not start with "textWeight__" or if the value is unsupported.
 */
export function transformTextWeightKeyToCss(styleKey: string): GeneratedCss {
  const propertyName = 'textWeight';
  const prefix = `${propertyName}__`;

  if (styleKey.startsWith(prefix) === false) {
    throw new Error(UNSUPPORTED_PROPERTY(propertyName, styleKey));
  }

  const textWeightValue = styleKey.substring(prefix.length);
  const cssValue: CssTextWeightValue | undefined =
    CssTextWeightValue[textWeightValue as TextWeightValue];

  if (cssValue === undefined) {
    throw new Error(UNSUPPORTED_VALUE(propertyName, textWeightValue, styleKey));
  }

  const cssRule = `.${styleKey} { font-weight: ${cssValue} }`;
  return { className: styleKey, cssRule };
}
