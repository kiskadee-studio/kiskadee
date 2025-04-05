import { borderStyleValues, type BorderStyleValue } from '@kiskadee/schema';
import { INVALID_KEY_PREFIX, UNSUPPORTED_VALUE } from '../errorMessages';

export function transformBorderStyleToCss(key: string): string {
  const prefix = 'borderStyle__';
  const invalidKey = !key.startsWith(prefix);

  if (invalidKey === true) {
    throw new Error(INVALID_KEY_PREFIX(prefix, key));
  }

  // Extract the border style value from the key
  const borderStyleValue = key.substring(prefix.length);

  // Validate that the value is one of the allowed border style values
  const invalidBorderStyleValue =
    borderStyleValues.includes(borderStyleValue as BorderStyleValue) === false;

  if (invalidBorderStyleValue === true) {
    throw new Error(UNSUPPORTED_VALUE('borderStyle', borderStyleValue, key));
  }

  return `.${key} { border-style: ${borderStyleValue} }`;
}
