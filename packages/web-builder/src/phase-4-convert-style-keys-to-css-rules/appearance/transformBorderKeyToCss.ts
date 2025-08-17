import { type BorderStyleValue, CssBorderStyleValue } from '@kiskadee/schema';
import { SEPARATORS } from '../../utils';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

/**
 * Builds a CSS rule that sets the border-style property from a compact style key.
 *
 * The style key must follow the "borderStyle__<value>" convention, where <value>
 * is a supported key of CssBorderStyleValue (e.g., "solid", "dashed").
 *
 * Example:
 * ```TypeScript
 * transformBorderKeyToCss('borderStyle__dashed', 'myClass');
 * // => ".myClass { border-style: dashed }"
 * ```
 *
 * @param styleKey - The namespaced property key to parse (e.g., "borderStyle__solid").
 * @param className - The CSS class name to use in the selector (without a leading dot).
 * @returns The full CSS rule string (selector plus declaration), e.g. ".foo { border-style: solid }".
 *
 * @throws Error when:
 *   - The key does not start with the expected "borderStyle" property segment.
 *   - The extracted value is missing, unknown, or multiple values are provided.
 */
export function transformBorderKeyToCss(styleKey: string, className: string): string {
  const propertyName = 'borderStyle';

  // Split the namespaced key by the configured value separator.
  // Expected shape: ["borderStyle", "<value>"] or invalid variants.
  const [property, borderStyleValue, ...rest] = styleKey.split(SEPARATORS.VALUE);

  // Validate that the property segment matches the supported property.
  const unsupportedProperty = property !== propertyName;

  if (unsupportedProperty === true) {
    // Surface a descriptive error if the property prefix is not supported.
    throw new Error(UNSUPPORTED_PROPERTY(property, styleKey));
  }

  // Map the parsed key (e.g., "solid") to its concrete CSS value via the schema enum.
  const value: CssBorderStyleValue | undefined =
    CssBorderStyleValue[borderStyleValue as BorderStyleValue];

  // Consider the value unsupported when:
  // - More than one value part is present (e.g., "borderStyle__solid__extra"), or
  // - The mapped value is not found in the enum (unknown or missing value).
  const moreThanOneValue = borderStyleValue !== undefined && rest.length > 0;
  const undefinedValue = value === undefined;
  const unsupportedValue = moreThanOneValue || undefinedValue;

  if (unsupportedValue === true) {
    // Provide a clear error for unknown, missing, or malformed values.
    throw new Error(UNSUPPORTED_VALUE(propertyName, borderStyleValue, styleKey));
  }

  // Produce a minimal CSS rule targeting the provided class name.
  // Note: className should not include a leading dot.
  return `.${className} { border-style: ${value} }`;
}
