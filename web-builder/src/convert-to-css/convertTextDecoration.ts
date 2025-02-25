import { type TextDecoration, textDecoration } from '@kiskadee/schema';

/**
 * Converts a text decoration property key into a CSS class rule.
 * For example, the key "textDecoration__underline" returns:
 *   ".textDecoration__underline { text-decoration: underline; }"
 *
 * @param key - The text decoration property key to process.
 * @returns The CSS rule as a string or null if the key doesn't match or has an invalid value.
 */
export function convertTextDecoration(key: string): string | null {
  // Check if the input key starts with the required prefix 'textDecoration__'.
  // If not, return null since the key doesn't follow the expected naming convention.
  if (!key.startsWith('textDecoration__')) {
    return null;
  }

  // Split the key into parts using the delimiter '__'.
  // We expect exactly 2 parts: the prefix and the actual decoration value.
  const parts = key.split('__');
  if (parts.length !== 2) {
    // Return null if there are extra parts or missing separators.
    return null;
  }

  // The second part is the decoration value, which should be one of the defined allowed values.
  // Here, we enforce the type cast to TextDecoration for type safety.
  const decoration = parts[1] as TextDecoration;

  // Check if the extracted decoration value is actually included in the allowed values,
  // which are maintained in the 'textDecoration' array. If not, return null.
  if (!textDecoration.includes(decoration)) {
    return null;
  }

  // All checks passed. Return the CSS rule as a formatted string.
  // For example, for key 'textDecoration__underline', this returns:
  //   ".textDecoration__underline { text-decoration: underline; }"
  return `.${key} { text-decoration: ${decoration}; }`;
}
