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
  paddingTop: 'padding-top',
  marginLeft: 'margin-left',
  borderWidth: 'border-width',
  boxWidth: 'width',
  boxHeight: 'height'
  // Add other mappings as needed.
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
 * Supports both standard keys (e.g. "paddingTop__16") and size-support keys (e.g. "textSize--s:sm:1__16").
 *
 * For size-support keys, if the custom token exactly matches one of the valid size properties,
 * then it is not included in the resulting CSS class name.
 *
 * Also supports an optional media query branch if the key uses "::" to denote a media query breakpoint.
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
    // Look for a matching dimension key with size support
    matchingDimension = dimensionKeys.find((dim) => key.startsWith(`${dim}--`));
    if (!matchingDimension) return null;
    const withoutPrefix = key.slice(`${matchingDimension}--`.length);

    if (withoutPrefix.includes('::')) {
      // Pattern: {customToken}::{mediaToken}__{value}
      let [customToken, remainder] = withoutPrefix.split('::');
      const parts = remainder.split('__');
      if (parts.length !== 2) return null;
      const [mediaToken, value] = parts as [string, string];

      const bpValue = breakpoints[mediaToken as BreakpointProps];
      if (bpValue === undefined) return null;
      mediaQuery = `@media (min-width: ${bpValue}px)`;
      valuePortion = value;

      // If custom token is a valid size prop, remove it.
      if (customToken.includes(':') && sizeProps.includes(customToken as SizeProps)) {
        customToken = '';
      } else if (customToken.includes(':')) {
        // Otherwise, if it contains colon(s), use only the first segment.
        customToken = customToken.split(':')[0];
      }

      className = customToken
        ? `${matchingDimension}-${customToken}__${value}`
        : `${getBaseClass(matchingDimension)}__${value}`;
    } else {
      // Pattern: {customToken}__{value}
      let [customToken, value] = withoutPrefix.split('__') as [string, string];
      if (!customToken || !value) return null;
      valuePortion = value;

      if (customToken.includes(':') && sizeProps.includes(customToken as SizeProps)) {
        customToken = '';
      } else if (customToken.includes(':')) {
        customToken = customToken.split(':')[0];
      }

      className = customToken
        ? `${matchingDimension}-${customToken}__${value}`
        : `${getBaseClass(matchingDimension)}__${value}`;
    }
  } else if (key.includes('__')) {
    // Standard key without size qualifier
    matchingDimension = dimensionKeys.find((dim) => key.startsWith(`${dim}__`));
    if (!matchingDimension) return null;

    const parts = key.split('__');
    if (parts.length !== 2) return null;
    const [_, value] = parts as [string, string];
    className = key; // Use the original key as the class name.
    valuePortion = value;
  } else {
    return null;
  }

  // Determine the CSS property based on the dimension.
  const cssProperty = cssPropertyMap[matchingDimension] || toKebabCase(matchingDimension);

  // Determine the CSS value.
  // For textSize, convert the numeric value to rem (assuming a base of 16px).
  let cssValue: string;
  if (matchingDimension === 'textSize') {
    const number = Number(valuePortion);
    cssValue = number ? `${number / 16}rem` : valuePortion;
  } else {
    cssValue = `${valuePortion}px`;
  }

  // Build the CSS rule.
  let rule = `.${className} { ${cssProperty}: ${cssValue}; }`;
  if (mediaQuery) {
    rule = `${mediaQuery} { ${rule} }`;
  }
  return rule;
}
