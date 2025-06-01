import { CssBorderStyleValue, type BorderStyleValue } from '@kiskadee/schema';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';
import type { GeneratedCss } from '../types';

/**
 * Converts a border style property key into a corresponding CSS rule object.
 *
 * For example, for the key "borderStyle__dashed", it returns:
 *   {
 *     className: "borderStyle__dashed",
 *     cssRule: ".borderStyle__dashed { border-style: dashed }"
 *   }
 *
 * @param key - The border style property key to process.
 * @returns An object containing:
 *   - className: the CSS class name (without the leading dot).
 *   - cssRule: the full CSS rule string (selector plus declarations).
 *
 * @throws An error if the key does not start with the expected prefix "borderStyle__".
 * @throws An error if the extracted border style value is not supported or does not exist in the CssBorderStyleValue mapping.
 */
export function transformBorderKeyToCss(key: string): GeneratedCss {
  const propertyName = 'borderStyle';
  const prefix = `${propertyName}__`;

  if (key.startsWith(prefix) === false) {
    throw new Error(UNSUPPORTED_PROPERTY(prefix, key));
  }

  const borderStyleValue = key.substring(prefix.length);
  const cssValue: CssBorderStyleValue | undefined =
    CssBorderStyleValue[borderStyleValue as BorderStyleValue];

  if (cssValue === undefined) {
    throw new Error(UNSUPPORTED_VALUE(propertyName, borderStyleValue, key));
  }

  const className = key;
  const cssRule = `.${key} { border-style: ${cssValue} }`;

  return { className, cssRule };
}
