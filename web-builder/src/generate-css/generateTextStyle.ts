/**
 * Generates a CSS class rule for a text italic property key.
 * For example, for key "textItalic__true" returns:
 *   ".textItalic__true { font-style: italic; }"
 *
 * @param key - The style key to process.
 * @returns The CSS rule as a string or null if the key doesn't match or if the value is invalid.
 */
export function generateTextStyle(key: string): string | null {
  if (!key.startsWith('textItalic__')) {
    return null;
  }

  const parts = key.split('__');
  if (parts.length !== 2) {
    return null;
  }

  let cssValue: string;
  if (parts[1] === 'true') {
    cssValue = 'italic';
  } else if (parts[1] === 'false') {
    cssValue = 'normal';
  } else {
    return null;
  }

  return `.${key} { font-style: ${cssValue}; }`;
}
