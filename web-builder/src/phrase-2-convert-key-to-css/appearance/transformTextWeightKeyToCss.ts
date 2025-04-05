import { CssTextWeightProperty, type TextWeight } from '@kiskadee/schema';
import { INVALID_KEY_PREFIX, UNSUPPORTED_VALUE } from '../errorMessages';

export function transformTextWeightKeyToCss(key: string): string {
  const prefix = 'textWeight__';
  const invalidKey = !key.startsWith(prefix);

  if (invalidKey === true) {
    throw new Error(INVALID_KEY_PREFIX(prefix, key));
  }

  const weightKey = key.substring(prefix.length);
  const fontWeightValue = CssTextWeightProperty[weightKey as TextWeight];
  const invalidWeightValue = fontWeightValue == null;

  if (invalidWeightValue === true) {
    throw new Error(UNSUPPORTED_VALUE('textWeight', weightKey, key));
  }

  return `.${key} { font-weight: ${fontWeightValue} }`;
}
