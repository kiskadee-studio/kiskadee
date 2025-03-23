// convertDimensions.ts
import {
  type Breakpoints,
  type SizeProps,
  sizeProps,
  dimensionKeys,
  type BreakpointProps
} from '@kiskadee/schema';

/**
 * Map of project dimension keys to their corresponding CSS property names.
 */
const cssPropertyMap: Record<string, string> = {
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
function getBaseClass(matchingDimension: string): string {
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
 * @returns The CSS rule string or null if the key is invalid.
 */
export function convertDimensions(key: string, breakpoints: Breakpoints): string | null {
  let matchingDimension: string | undefined;
  let className: string;
  let mediaQuery: string | null = null;
  let valuePortion: string;

  if (key.includes('--')) {
    // Find a matching dimension key with support for custom tokens (size and/or media-based)
    matchingDimension = dimensionKeys.find((dim) => key.startsWith(`${dim}--`));
    if (!matchingDimension) {
      // Exception 1
      return null;
    }
    const withoutPrefix = key.slice(`${matchingDimension}--`.length);

    if (withoutPrefix.includes('::')) {
      // Pattern: {customToken}::{mediaToken}__{value}
      const [customToken, remainder] = withoutPrefix.split('::');
      const parts = remainder.split('__');
      if (parts.length !== 2) {
        // Exception 2
        return null;
      }
      const [mediaToken, value] = parts as [string, string];

      const bpValue = breakpoints[mediaToken as BreakpointProps];
      if (bpValue === undefined) {
        // Exception 3
        return null;
      }
      mediaQuery = `@media (min-width: ${bpValue}px)`;
      valuePortion = value;

      // If the custom token is a valid size prop, drop it.
      if (!sizeProps.includes(customToken as SizeProps)) {
        // Exception 4
        return null;
      }

      const breakpointModifier = mediaToken.replace('bp:', '').replace(/:/g, '');

      className = `${getBaseClass(matchingDimension)}--${breakpointModifier}__${value}`;
    } else {
      // Pattern: {customToken}__{value}
      const [token, value] = withoutPrefix.split('__') as [string, string];
      const validToken = token != null && sizeProps.includes(token as SizeProps);
      const validValue = value != null;

      if (!validToken || !validValue) {
        // Exception 5
        return null;
      }

      valuePortion = value;

      className = `${getBaseClass(matchingDimension)}__${value}`;
    }
  } else if (key.includes('__')) {
    // Standard key without any token.
    matchingDimension = dimensionKeys.find((dim) => key.startsWith(`${dim}__`));
    if (!matchingDimension) {
      // Exception 6
      return null;
    }

    const parts = key.split('__');
    if (parts.length !== 2) {
      // Exception 7
      return null;
    }
    const [_, value] = parts as [string, string];
    className = key;
    valuePortion = value;
  } else {
    // Exception 8
    return null;
  }

  // Determine the CSS property.
  const cssProperty = cssPropertyMap[matchingDimension];

  // Determine the numeric value.
  let cssValue: string;
  if (matchingDimension === 'textSize') {
    const number = Number(valuePortion);
    cssValue = number ? `${number / 16}rem` : valuePortion;
  } else {
    cssValue = `${valuePortion}px`;
  }

  // Build the final CSS rule.
  let rule = `.${className} { ${cssProperty}: ${cssValue}; }`;
  if (mediaQuery) {
    rule = `${mediaQuery} { ${rule} }`;
  }
  return rule;
}
