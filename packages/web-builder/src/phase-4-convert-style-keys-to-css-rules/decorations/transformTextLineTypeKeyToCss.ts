import {
  CssDecorationProperty,
  CssTextDecorationValue,
  type DecorationProperty,
  type TextLineTypeValue
} from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY_NAME, UNSUPPORTED_VALUE } from '../errorMessages';
import type { GeneratedCss } from '../phrase2.types';

const { textLineType }: typeof CssDecorationProperty = CssDecorationProperty;

/**
 * Converts a text‐decoration style key into a GeneratedCss object.
 *
 * The key must be in the format "textDecoration__<value>", where <value> is one of the
 * values defined in CssTextDecorationValue.
 *
 * @example
 * ```ts
 * const result = transformTextDecorationKeyToCss("textDecoration__underline");
 * // result:
 * // {
 * //   className: "textDecoration__underline",
 * //   cssRule: ".textDecoration__underline { text-decoration: underline; }"
 * // }
 * ```
 *
 * @param styleKey - The text‐decoration key (e.g. "textDecoration__underline")
 * @returns A GeneratedCss object containing:
 *   - `className`: the raw key (no leading dot)
 *   - `cssRule`: the full CSS rule string
 * @throws Error if the property isn’t "textDecoration", the format is wrong or the value is unsupported.
 */
export function transformTextLineTypeKeyToCss(styleKey: string): GeneratedCss {
  const propertyName: DecorationProperty = 'textLineType';
  const styleParts = styleKey.split('__');
  const styleProperty = styleParts[0];
  const styleValue = styleParts[1] as TextLineTypeValue;

  if (styleProperty !== propertyName) {
    throw new Error(UNSUPPORTED_PROPERTY_NAME(propertyName, styleKey));
  }

  if (styleParts.length !== 2) {
    const [, ...invalidValue] = styleParts;
    throw new Error(UNSUPPORTED_VALUE(propertyName, invalidValue.join('__'), styleKey));
  }

  const value: CssTextDecorationValue | undefined = CssTextDecorationValue[styleValue];

  if (value === undefined) {
    throw new Error(UNSUPPORTED_VALUE(propertyName, styleValue, styleKey));
  }

  const cssRule = `.${styleKey} { ${textLineType}: ${value}; }`;

  return {
    className: styleKey,
    cssRule
  };
}
