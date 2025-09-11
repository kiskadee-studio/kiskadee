import {
  type Breakpoints,
  type BreakpointValue,
  type ElementSizeValue,
  elementSizeValues,
  type ScaleProperty,
  type StyleKey,
  scaleProperties
} from '@kiskadee/schema';

export const ERROR_NO_MATCHING_SCALE_PROPERTY = 'No matching scale key found.';
export const ERROR_INVALID_MEDIA_QUERY_PATTERN =
  'Invalid media query pattern; expected exactly one media token and one value.';
export const ERROR_INVALID_MEDIA_TOKEN = 'Invalid media query token.';
export const ERROR_INVALID_CUSTOM_TOKEN = 'Invalid custom size token.';
export const ERROR_MISSING_VALUE = 'Missing value for scale.';
export const ERROR_NO_STANDARD_SCALE_KEY = 'No matching standard scale key found.';
export const ERROR_INVALID_STANDARD_PATTERN =
  'Invalid standard scale key format; unexpected number of parts.';
export const ERROR_INVALID_KEY_FORMAT = 'Invalid scale key format; missing required delimiters.';

// TODO: convert to enum
/**
 * Map of project dimension keys to their corresponding CSS property names.
 */
const cssPropertyMap: Record<ScaleProperty, string> = {
  borderRadius: 'border-radius',
  borderWidth: 'border-width',
  boxHeight: 'height',
  boxWidth: 'width',
  marginBottom: 'margin-bottom',
  marginLeft: 'margin-left',
  marginRight: 'margin-right',
  marginTop: 'margin-top',
  paddingBottom: 'padding-bottom',
  paddingLeft: 'padding-left',
  paddingRight: 'padding-right',
  paddingTop: 'padding-top',
  textHeight: 'line-height',
  textSize: 'font-size'
};

/**
 * Converts a dimension key into a CSS rule.
 *
 * Supports both standard keys (e.g. "paddingTop__16") and keys with size and/or media query support
 * (e.g. "paddingTop--s:sm:1::bp:lg:1__16").
 *
 * When the key includes a media token (after "::") for a breakpoint, the breakpoint token is
 * simplified, for example, "bp:lg:1" becomes "lg1". Also, if the size token is valid (for instance "s:sm:1"),
 * it is dropped.
 *
 * @param styleKey - The scale key.
 * @param breakpoints - Object containing breakpoint definitions.
 * @param className
 * @returns An object with `className` and `cssRule`.
 */
export function transformScaleKeyToCss(
  styleKey: StyleKey,
  breakpoints: Breakpoints,
  className: string
): string {
  let scaleProperty: ScaleProperty | undefined;
  let mediaQuery: string | undefined;
  let scaleValue: string = '';

  const hasSizeSeparator = styleKey.includes('++') === true;
  const hasValueSeparator = styleKey.includes('__') === true;

  if (hasSizeSeparator === true) {
    scaleProperty = scaleProperties.find((scaleProperty) => styleKey.startsWith(scaleProperty));
    const isScalePropertyValid = scaleProperty != null;

    if (isScalePropertyValid === false) {
      throw new Error(ERROR_NO_MATCHING_SCALE_PROPERTY);
    }

    const withoutPrefix = styleKey.slice(`${scaleProperty}++`.length);
    const hasBreakpointSeparator = withoutPrefix.includes('::');

    if (hasBreakpointSeparator === true) {
      const [sizeToken, remainder] = withoutPrefix.split('::') as [ElementSizeValue, string];
      const parts = remainder.split('__') as [BreakpointValue, string];
      if (parts.length !== 2) {
        throw new Error(ERROR_INVALID_MEDIA_QUERY_PATTERN);
      }
      const [mediaToken, value] = parts;
      const bpValue = breakpoints[mediaToken];
      const hasValidBreakpoint = bpValue != null;

      if (hasValidBreakpoint === false) {
        throw new Error(ERROR_INVALID_MEDIA_TOKEN);
      }

      const isValidSizeToken = elementSizeValues.includes(sizeToken);

      if (isValidSizeToken === false) {
        throw new Error(ERROR_INVALID_CUSTOM_TOKEN);
      }

      mediaQuery = `@media (min-width: ${bpValue}px)`;
      scaleValue = value;
    } else {
      const [sizeToken, value] = withoutPrefix.split('__') as [ElementSizeValue, string];
      const isValidToken = sizeToken != null && elementSizeValues.includes(sizeToken);
      const hasValue = value != null;

      if (isValidToken === false) {
        throw new Error(ERROR_INVALID_CUSTOM_TOKEN);
      }

      if (hasValue === false) {
        throw new Error(ERROR_MISSING_VALUE);
      }

      scaleValue = value;
    }
  } else if (hasValueSeparator === true) {
    scaleProperty = scaleProperties.find((scaleProperty) => styleKey.startsWith(scaleProperty));
    const isScalePropertyValid = scaleProperty != null;

    if (isScalePropertyValid === false) {
      throw new Error(ERROR_NO_STANDARD_SCALE_KEY);
    }

    const parts = styleKey.split('__');

    if (parts.length !== 2) {
      throw new Error(ERROR_INVALID_STANDARD_PATTERN);
    }

    const [, value] = parts as [string, string];
    scaleValue = value;
  } else {
    throw new Error(ERROR_INVALID_KEY_FORMAT);
  }

  const cssProperty = cssPropertyMap[scaleProperty as unknown as ScaleProperty];
  let cssValue: string;
  if (scaleProperty === 'textSize') {
    cssValue = `${Number(scaleValue) / 16}rem`;
  } else {
    cssValue = `${scaleValue}px`;
  }

  let rule = `.${className} { ${cssProperty}: ${cssValue} }`;

  if (mediaQuery) {
    rule = `${mediaQuery} { ${rule} }`;
  }

  return rule;
}
