// Updated error message for an invalid key prefix with the key value included.
export const UNSUPPORTED_PROPERTY = (expectedPrefix: string, key: string): string =>
  `Invalid format for key "${key}". Expected key to start with "${expectedPrefix}".`;

// Updated error message for an unsupported value with the key included.
export const UNSUPPORTED_VALUE = (property: string, receivedValue: string, key: string): string =>
  `Unsupported "${property}" value "${receivedValue}" in key "${key}".`;
