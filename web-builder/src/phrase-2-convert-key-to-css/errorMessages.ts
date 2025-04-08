// Updated error message for an invalid key prefix with the key value included.
export const UNSUPPORTED_PROPERTY = (expectedPrefix: string, styleKey: string): string =>
  `Invalid format for style key "${styleKey}". Expected style key to start with "${expectedPrefix}__".`;

// Updated error message for an unsupported value with the key included.
export const UNSUPPORTED_VALUE = (
  property: string,
  receivedValue: string,
  styleKey: string
): string => `Unsupported "${property}" value "${receivedValue}" in key "${styleKey}".`;
