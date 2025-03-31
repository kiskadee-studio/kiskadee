import { borderStyleValues, type BorderStyleValue } from '@kiskadee/schema';

export function transformBorderStyleToCss(key: string): string {
  const prefix = 'borderStyle__';
  const invalidKey = !key.startsWith(prefix);

  if (invalidKey === true) {
    throw new Error(`Invalid format. Expected key to start with "${prefix}".`);
  }

  // Extract the border style value from the key
  const borderStyleValue = key.substring(prefix.length);

  // Validate that the value is one of the allowed border style values
  const invalidBorderStyleValue =
    borderStyleValues.includes(borderStyleValue as BorderStyleValue) === false;

  if (invalidBorderStyleValue === true) {
    throw new Error(`Unsupported borderStyle value: ${borderStyleValue}`);
  }

  return `.${key} { border-style: ${borderStyleValue} }`;
}
