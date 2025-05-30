export const UNSUPPORTED_PROPERTY = (propertyName: string, styleKey: string): string =>
  `Invalid style key "${styleKey}". Expected the key to be in the format "<property>__<value>" with the property part being "${propertyName}".`;

export const UNSUPPORTED_VALUE = (
  propertyName: string,
  invalidValue: string,
  styleKey: string
): string =>
  `Unsupported value "${invalidValue}" for property "${propertyName}" in style key "${styleKey}".`;

// Shadow ------------------------------------------------------------------------------------------

export const UNSUPPORTED_INTERACTION_STATE = (state: string, styleKey: string): string =>
  `Unsupported interaction state "${state}" in shadow key "${styleKey}".`;

export const INVALID_SHADOW_COLOR_VALUE = 'Invalid shadow color value.';
