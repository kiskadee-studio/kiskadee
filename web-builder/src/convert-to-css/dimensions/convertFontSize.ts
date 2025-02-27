import type { Breakpoints } from '@kiskadee/schema';

/**
 * Converts a font size key into a CSS rule.
 *
 * For a simple key like "fontSize--sm__12":
 *   The CSS rule will output a class name ".fontSize-sm" with font-size: 12px.
 *
 * For a key with a media query modifier like "fontSize--md::lg1__14":
 *   The class name becomes ".fontSize-md", and the rule is wrapped inside a media query using the breakpoint value for lg1.
 *
 * @param key - The font size key to process.
 * @param breakpoints - An object containing breakpoint definitions.
 * @returns The CSS rule as a string or null if the key is invalid.
 */
export function convertFontSize(key: string, breakpoints: Breakpoints): string | null {
  if (!key.startsWith('fontSize--')) {
    return null;
  }

  // Remove the prefix "fontSize--".
  const withoutPrefix = key.slice('fontSize--'.length);

  // Determine if there is a media query modifier.
  let classPart: string;
  let breakpointKey: keyof Breakpoints;
  let sizeValue: string;
  let mediaQuery: string | null = null;

  if (withoutPrefix.includes('::')) {
    // Expected pattern: {classPart}::{breakpointKey}__{value}
    const [left, right] = withoutPrefix.split('::');
    classPart = left; // e.g. "md"
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
    [classPart, sizeValue] = parts as [keyof Breakpoints | string, string];
  }

  const numericValue = Number(sizeValue);
  if (Number.isNaN(numericValue)) {
    return null;
  }

  // Construct a new class name: "fontSize--" is replaced by "fontSize-" and stripped of extra hyphens if needed.
  // For example, "fontSize--sm__12" becomes ".fontSize-sm"
  const className = `fontSize-${classPart}`;

  const rule = `${mediaQuery ? `${mediaQuery} {\n  ` : ''}.${className} {
  font-size: ${numericValue}px;
}${mediaQuery ? '\n}' : ''}`;

  return rule;
}
