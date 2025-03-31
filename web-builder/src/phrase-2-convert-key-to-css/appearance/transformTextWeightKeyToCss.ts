import { CssTextWeightProperty, type TextWeight } from '@kiskadee/schema';

export function transformTextWeightKeyToCss(key: string): string {
  const prefix = 'textWeight__';
  const invalidKey = !key.startsWith(prefix);

  if (invalidKey === true) {
    throw new Error(`Invalid format. Expected the key (key: ${key}) to start with "${prefix}".`);
  }

  const weightKey = key.substring(prefix.length);
  const fontWeight = CssTextWeightProperty[weightKey as TextWeight];

  if (fontWeight == null) {
    throw new Error(`Unsupported text weight: ${weightKey} (key: ${key}).`);
  }

  return `.${key} { font-weight: ${fontWeight} }`;
}
