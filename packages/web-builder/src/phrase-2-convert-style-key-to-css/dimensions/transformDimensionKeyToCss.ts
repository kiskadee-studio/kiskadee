import type { GeneratedCss } from '../phrase2.types';
import {
  type Breakpoints,
  type SizeProps,
  sizeProps,
  dimensionKeys,
  type BreakpointProps,
  type DimensionKeys
} from '@kiskadee/schema';

export const ERROR_NO_MATCHING_DIMENSION_KEY = 'No matching dimension key found.';
export const ERROR_INVALID_MEDIA_QUERY_PATTERN =
  'Invalid media query pattern; expected exactly one media token and one value.';
export const ERROR_INVALID_MEDIA_TOKEN = 'Invalid media query token.';
export const ERROR_INVALID_CUSTOM_TOKEN = 'Invalid custom size token.';
export const ERROR_MISSING_VALUE = 'Missing value for dimension.';
export const ERROR_NO_STANDARD_DIMENSION_KEY = 'No matching standard dimension key found.';
export const ERROR_INVALID_STANDARD_PATTERN =
  'Invalid standard dimension key format; unexpected number of parts.';
export const ERROR_INVALID_KEY_FORMAT =
  'Invalid dimension key format; missing required delimiters.';

/**
 * Map of project dimension keys to their corresponding CSS property names.
 */
const cssPropertyMap: Record<DimensionKeys, string> = {
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
 * Returns the base class to be used in the CSS selector.
 *
 * If the dimension is "boxWidth" or "boxHeight", uses the mapped CSS property;
 * otherwise, uses the dimension key.
 *
 * @param matchingDimension - The dimension key.
 * @returns The base class name for the CSS rule.
 */
function getBaseClass(matchingDimension: DimensionKeys): string {
  return matchingDimension.startsWith('box')
    ? cssPropertyMap[matchingDimension]
    : matchingDimension;
}

/**
 * Converts a dimension key into a CSS rule.
 *
 * Supports both standard keys (e.g. "paddingTop__16") and keys with size and/or media query support
 * (e.g. "paddingTop--s:sm:1::bp:lg:1__16").
 *
 * When the key includes a media token (after "::") for a breakpoint, the breakpoint token is simplified,
 * for example, "bp:lg:1" becomes "lg1". Also, if the size token is valid (for instance "s:sm:1"), it is dropped.
 *
 * @param key - The dimension key.
 * @param breakpoints - Object containing breakpoint definitions.
 * @returns An object with `className` and `cssRule`.
 */
export function transformDimensionKeyToCss(key: string, breakpoints: Breakpoints): GeneratedCss {
  let dimensionKey: DimensionKeys | undefined;
  let className: string;
  let mediaQuery: string | undefined;
  let valuePortion: string;

  if (key.includes('--') === true) {
    dimensionKey = dimensionKeys.find((dim) => key.startsWith(`${dim}--`));
    if (dimensionKey == null) {
      throw new Error(ERROR_NO_MATCHING_DIMENSION_KEY);
    }
    const withoutPrefix = key.slice(`${dimensionKey}--`.length);

    if (withoutPrefix.includes('::') === true) {
      const [customToken, remainder] = withoutPrefix.split('::') as [SizeProps, string];
      const parts = remainder.split('__') as [BreakpointProps, string];
      if (parts.length !== 2) {
        throw new Error(ERROR_INVALID_MEDIA_QUERY_PATTERN);
      }
      const [mediaToken, value] = parts;
      const bpValue = breakpoints[mediaToken];
      if (bpValue == null) {
        throw new Error(ERROR_INVALID_MEDIA_TOKEN);
      }
      mediaQuery = `@media (min-width: ${bpValue}px)`;
      valuePortion = value;
      if (sizeProps.includes(customToken) === false) {
        throw new Error(ERROR_INVALID_CUSTOM_TOKEN);
      }
      const breakpointModifier = mediaToken.replace('bp:', '').replace(/:/g, '');
      className = `${getBaseClass(dimensionKey)}--${breakpointModifier}__${value}`;
    } else {
      const [token, value] = withoutPrefix.split('__') as [SizeProps, string];
      const validToken = token != null && sizeProps.includes(token) === true;
      const validValue = value != null;
      if (validToken === false) {
        throw new Error(ERROR_INVALID_CUSTOM_TOKEN);
      }
      if (validValue === false) {
        throw new Error(ERROR_MISSING_VALUE);
      }
      valuePortion = value;
      className = `${getBaseClass(dimensionKey)}__${value}`;
    }
  } else if (key.includes('__') === true) {
    dimensionKey = dimensionKeys.find((dim) => key.startsWith(`${dim}__`));
    if (dimensionKey == null) {
      throw new Error(ERROR_NO_STANDARD_DIMENSION_KEY);
    }
    const parts = key.split('__');
    if (parts.length !== 2) {
      throw new Error(ERROR_INVALID_STANDARD_PATTERN);
    }
    const [, value] = parts as [string, string];
    className = key;
    valuePortion = value;
  } else {
    throw new Error(ERROR_INVALID_KEY_FORMAT);
  }

  const cssProperty = cssPropertyMap[dimensionKey];
  let cssValue: string;
  if (dimensionKey === 'textSize') {
    const num = Number(valuePortion);
    cssValue = num ? `${num / 16}rem` : valuePortion;
  } else {
    cssValue = `${valuePortion}px`;
  }

  let rule = `.${className} { ${cssProperty}: ${cssValue}; }`;
  if (mediaQuery) {
    rule = `${mediaQuery} { ${rule} }`;
  }
  return { className, cssRule: rule };
}
