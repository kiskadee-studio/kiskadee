export const UNSUPPORTED_PROPERTY = (propertyName: string, styleKey: string): string =>
  `Invalid style key "${styleKey}". Expected the key to be in the format "<property>__<value>" with the property part being "${propertyName}".`;

export const UNSUPPORTED_VALUE = (
  propertyName: string,
  invalidValue: string,
  styleKey: string
): string =>
  `Unsupported value "${invalidValue}" for property "${propertyName}" in style key "${styleKey}".`;
