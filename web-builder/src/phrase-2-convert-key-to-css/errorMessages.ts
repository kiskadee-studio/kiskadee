// Updated error message for an invalid key prefix with the key value included.
export const INVALID_KEY_PREFIX = (expectedPrefix: string, key: string): string =>
  `Invalid format for key "${key}". Expected key to start with "${expectedPrefix}".`;

// Updated error message for an unsupported value with the key included.
export const UNSUPPORTED_VALUE = (property: string, receivedValue: string, key: string): string =>
  `Unsupported ${property} value "${receivedValue}" in key "${key}".`;

export const INVALID_KEY_FORMAT = (property: string, key: string): string =>
  `Invalid format for key "${key}" with property "${property}". Expected exactly one delimiter "__".`;
