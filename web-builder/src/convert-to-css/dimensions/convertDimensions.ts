// convertDimensions.ts
import {
  type Breakpoints,
  type SizeProps,
  sizeProps,
  dimensionKeys,
  type BreakpointProps
} from '@kiskadee/schema';

/**
 * Utility that converts a camelCase string to kebab-case.
 *
 * @param str - The camelCase string.
 * @returns The kebab-case string.
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Map of project dimension keys to their corresponding CSS property names.
 */
const cssPropertyMap: Record<string, string> = {
  textSize: 'font-size',
  textHeight: 'line-height',
  paddingTop: 'padding-top',
  marginLeft: 'margin-left',
  borderWidth: 'border-width',
  boxWidth: 'width',
  boxHeight: 'height'
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
      return null;
    }
    const withoutPrefix = key.slice(`${matchingDimension}--`.length);

    if (withoutPrefix.includes('::')) {
      // Pattern: {customToken}::{mediaToken}__{value}
      let [customToken, remainder] = withoutPrefix.split('::');
      const parts = remainder.split('__');
      if (parts.length !== 2) {
        return null;
      }
      const [mediaToken, value] = parts as [string, string];

      const bpValue = breakpoints[mediaToken as BreakpointProps];
      if (bpValue === undefined) {
        return null;
      }
      mediaQuery = `@media (min-width: ${bpValue}px)`;
      valuePortion = value;

      // If the custom token is a valid size prop, drop it.
      if (sizeProps.includes(customToken as SizeProps)) {
        customToken = '';
      } else {
        return null;
      }

      // Process the media token: simplify it by removing "bp:" and any colons.
      let breakpointModifier = '';
      if (mediaToken.startsWith('bp:')) {
        breakpointModifier = mediaToken.replace('bp:', '').replace(/:/g, '');
      } else {
        return null;
      }

      // Build the final class name.
      // If the size token was dropped, use only the base class name with the breakpoint modifier.
      if (customToken) {
        className = `${getBaseClass(matchingDimension)}-${customToken}--${breakpointModifier}__${value}`;
      } else {
        className = `${getBaseClass(matchingDimension)}--${breakpointModifier}__${value}`;
      }
    } else {
      // Pattern: {customToken}__{value}
      let [customToken, value] = withoutPrefix.split('__') as [string, string];
      if (!customToken || !value) {
        return null;
      }
      valuePortion = value;
      customToken = customToken.trim();

      if (sizeProps.includes(customToken as SizeProps)) {
        customToken = '';
      } else {
        return null;
      }

      className = customToken
        ? `${getBaseClass(matchingDimension)}-${customToken}__${value}`
        : `${getBaseClass(matchingDimension)}__${value}`;
    }
  } else if (key.includes('__')) {
    // Standard key without any token.
    matchingDimension = dimensionKeys.find((dim) => key.startsWith(`${dim}__`));
    if (!matchingDimension) {
      return null;
    }

    const parts = key.split('__');
    if (parts.length !== 2) {
      return null;
    }
    const [_, value] = parts as [string, string];
    className = key;
    valuePortion = value;
  } else {
    return null;
  }

  // Determine the CSS property.
  const cssProperty = cssPropertyMap[matchingDimension] || toKebabCase(matchingDimension);

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
