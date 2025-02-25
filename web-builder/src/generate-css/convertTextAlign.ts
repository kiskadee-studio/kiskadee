import { type TextAlign, textAlign } from '@kiskadee/schema';

/**
 * Converts a text alignment property key into a CSS class rule.
 * For example, the key "textAlign__center" returns:
 *   ".textAlign__center { text-align: center; }"
 *
 * @param key - The text alignment property key to process.
 * @returns The CSS rule as a string or null if the key doesn't match or has an invalid value.
 */
export function convertTextAlign(key: string): string | null {
  // Check if the input key starts with the required prefix 'textAlign__'.
  // If not, return null since the key doesn't follow the expected naming convention.
  if (!key.startsWith('textAlign__')) {
    return null;
  }

  // Split the key into parts using the delimiter '__'.
  // We expect exactly 2 parts: the prefix and the actual alignment value.
  const parts = key.split('__');
  if (parts.length !== 2) {
    // Return null if there are extra parts or missing separators.
    return null;
  }

  // The second part is the alignment value, which should be one of a defined set of allowed values.
  // Here, we enforce the type cast to TextAlign for type safety.
  const alignment = parts[1] as TextAlign;

  // Check if the extracted alignment value is actually included in the allowed values,
  // which are maintained in the 'textAlign' array. If not, return null.
  if (!textAlign.includes(alignment)) {
    return null;
  }

  // All checks passed. Return the CSS rule as a formatted string.
  // For example, for key 'textAlign__center', this returns:
  //   ".textAlign__center { text-align: center; }"
  return `.${key} { text-align: ${alignment}; }`;
}
