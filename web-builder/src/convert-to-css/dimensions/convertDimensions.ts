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
 * For keys with a class part (like "textSize--sm__16"):
 *   It generates a class with the provided class suffix.
 *
 * For keys without a class part (like "paddingTop__12"):
 *   It uses the original key as the class selector.
 *
 * For keys using media query modifiers:
 *   It wraps the CSS rule in the corresponding media query based on the breakpoints.
 *
 * @param key - The dimension key to process.
 * @param breakpoints - An object containing breakpoint definitions.
 * @returns The CSS rule as a string or null if the key is invalid.
 */
export function convertDimensions(key: string, breakpoints: Breakpoints): string | null {
  let matchingDimension: string | undefined;
  let className: string;
  let sizeValue: string;
  let mediaQuery: string | null = null;

  // First, check for keys using the custom class part marker: '--'
  if (key.includes('--')) {
    matchingDimension = dimensionKeys.find(dim => key.startsWith(`${dim}--`));
    if (!matchingDimension) {
      return null;
    }
    const withoutPrefix = key.slice((matchingDimension + '--').length);
    // Support media query modifier if present.
    if (withoutPrefix.includes('::')) {
      // Expected pattern: {customName}::{breakpointKey}__{value}
      const [customName, remainder] = withoutPrefix.split('::');
      const parts = remainder.split('__');
      if (parts.length !== 2) {
        return null;
      }
      const [breakpointKey, value] = parts as [keyof Breakpoints, string];
      const bpValue = breakpoints[breakpointKey];
      if (bpValue === undefined) {
        return null;
      }
      mediaQuery = `@media (min-width: ${bpValue}px)`;
      sizeValue = value;
      className = `${matchingDimension}-${customName}`;
    } else {
      // Expected pattern: {customName}__{value}
      const parts = withoutPrefix.split('__');
      if (parts.length !== 2) {
        return null;
      }
      const [customName, value] = parts as [string, string];
      sizeValue = value;
      className = `${matchingDimension}-${customName}`;
    }
  } else if (key.includes('__')) {
    // For keys that do not have a custom class part,
    // we use the key itself as the class name.
    matchingDimension = dimensionKeys.find(dim => key.startsWith(`${dim}__`));
    if (!matchingDimension) {
      return null;
    }
    sizeValue = key.slice((matchingDimension + '__').length);
    className = key;
  } else {
    return null;
  }

  const numericValue = Number(sizeValue);
  if (Number.isNaN(numericValue)) {
    return null;
  }

  // Determine the CSS property name and unit.
  const propertyName = cssPropertyMap[matchingDimension] || toKebabCase(matchingDimension);
  let unit: string;
  let outputValue: number | string = numericValue;
  if (matchingDimension === 'textSize') {
    outputValue = numericValue / 16;
    unit = 'rem';
  } else {
    unit = 'px';
  }

  // Build CSS rule – if a media query is specified, wrap the rule.
  const ruleBody = `.${className} {
  ${propertyName}: ${outputValue}${unit};
}`;
  const rule = mediaQuery ? `
${mediaQuery} {
  ${ruleBody}
}` : ruleBody;

  return rule;
}