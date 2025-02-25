/**
 * Generates a CSS class rule for a text italic property key.
 * For example, for key "textItalic__true" returns:
 *   ".textItalic__true { font-style: italic; }"
 *
 * @param key - The style key to process.
 * @returns The CSS rule as a string or null if the key doesn't match.
 */
export function generateCssTextStyle(key: string): string | null {
  if (!key.startsWith('textItalic__')) {
    return null;
  }

  const parts = key.split('__');
  if (parts.length !== 2) {
    return null;
  }

  // If the value is "true", then use italic; otherwise default to normal.
  const cssValue = parts[1] === 'true' ? 'italic' : 'normal';
  return `.${key} { font-style: ${cssValue}; }`;
}
