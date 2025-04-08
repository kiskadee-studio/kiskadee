export const UNSUPPORTED_PROPERTY = (expectedProperty: string, styleKey: string): string =>
  `Invalid style key "${styleKey}". Expected the key to be in the format "<property>__<value>" with the property part being "${expectedProperty}".`;

export const UNSUPPORTED_VALUE = (
  property: string,
  receivedValue: string,
  styleKey: string
): string =>
  `Unsupported value "${receivedValue}" for property "${property}" in style key "${styleKey}".`;
