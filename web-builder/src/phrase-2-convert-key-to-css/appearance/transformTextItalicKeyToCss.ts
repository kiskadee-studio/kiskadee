/**
 * Converts a text italic property key into a CSS class rule.
 * For example, the key "textItalic__true" returns:
 *   ".textItalic__true { font-style: italic; }"
 *
 * @param key - The text italic property key to process.
 * @returns The CSS rule as a string or null if the key doesn't match or has an invalid value.
 */
export function transformTextItalicKeyToCss(key: string): string | null {
  // Check if the input key starts with the required prefix 'textItalic__'.
  // If not, return null as the key doesn't follow the expected naming convention.
  if (!key.startsWith('textItalic__')) {
    return null;
  }

  // Split the key into parts using the delimiter '__'.
  // We expect exactly 2 parts: the prefix and the italic value.
  const parts = key.split('__');
  if (parts.length !== 2) {
    // Return null if there are extra parts or missing separators.
    return null;
  }

  // The second part of the key represents the italic value.
  // It should be either 'true' (for italic styling) or 'false' (for normal styling).
  let cssValue: string;
  if (parts[1] === 'true') {
    cssValue = 'italic';
  } else if (parts[1] === 'false') {
    cssValue = 'normal';
  } else {
    // Return null if the value is not recognized.
    return null;
  }

  // All checks passed. Return the CSS rule as a formatted string.
  // For example, for key 'textItalic__true', this returns:
  //   ".textItalic__true { font-style: italic; }"
  return `.${key} { font-style: ${cssValue}; }`;
}
