// convertDimensions.ts
import type { Breakpoints } from '@kiskadee/schema';
import { dimensionKeys } from '@kiskadee/schema';

/**
 * Utility to convert camelCase string to kebab-case.
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
  width: 'width',
  height: 'height'
  // Add other mappings as needed.
};

/**
 * Converts a dimension key into a CSS rule.
 *
 * For a simple key like "textSize--sm__16":
 *   If the key is for textSize, it outputs a class ".textSize-sm" with "font-size: 1rem;"
 *   (since 16px is converted to 1 rem).
 *
 * For a key with a media query modifier like "paddingTop--md::lg1__20":
 *   The class name becomes ".paddingTop-md" and the CSS rule is wrapped inside a media query
 *   using the breakpoint value defined by "lg1".
 *
 * @param key - The dimension key to process.
 * @param breakpoints - An object containing breakpoint definitions.
 * @returns The CSS rule as a string or null if the key is invalid.
 */
export function convertDimensions(key: string, breakpoints: Breakpoints): string | null {
  // Find the dimension key that matches the start of the key.
  const matchingDimension = dimensionKeys.find((dim) => key.startsWith(`${dim}--`));
  if (!matchingDimension) {
    return null;
  }

  // Remove the dimension key prefix along with the separator (“--”)
  const withoutPrefix = key.slice(`${matchingDimension}--`.length);

  let classPart: string;
  let breakpointKey: keyof Breakpoints | null = null;
  let sizeValue: string;
  let mediaQuery: string | null = null;

  // Check if the key contains a media query modifier using "::"
  if (withoutPrefix.includes('::')) {
    // Expected pattern: {classPart}::{breakpointKey}__{value}
    const [left, right] = withoutPrefix.split('::');
    classPart = left;
    const parts = right.split('__');
    if (parts.length !== 2) {
      return null;
    }
    [breakpointKey, sizeValue] = parts as [keyof Breakpoints, string];
    const bpValue = breakpoints[breakpointKey];
    if (bpValue === undefined) {
      return null;
    }
    mediaQuery = `@media (min-width: ${bpValue}px)`;
  } else {
    // Expected simple pattern: {classPart}__{value}
    const parts = withoutPrefix.split('__');
    if (parts.length !== 2) {
      return null;
    }
    [classPart, sizeValue] = parts as [string, string];
  }

  const numericValue = Number(sizeValue);
  if (Number.isNaN(numericValue)) {
    return null;
  }

  // Determine the CSS property name and unit.
  // Look up the property from cssPropertyMap and fall back to using toKebabCase if not mapped.
  const propertyName = cssPropertyMap[matchingDimension] || toKebabCase(matchingDimension);
  let unit: string;
  let outputValue: number | string = numericValue;

  // For textSize, we need to convert the raw numeric value from px to rem.
  if (matchingDimension === 'textSize') {
    outputValue = numericValue / 16;
    unit = 'rem';
  } else {
    unit = 'px';
  }

  // Build a new class name using the dimension key and class part.
  const className = `${matchingDimension}-${classPart}`;

  const ruleContent = `.${className} {
  ${propertyName}: ${outputValue}${unit};
}`;

  // Wrap in media query if needed.
  return mediaQuery ? `${mediaQuery} {\n  ${ruleContent}\n}` : ruleContent;
}
