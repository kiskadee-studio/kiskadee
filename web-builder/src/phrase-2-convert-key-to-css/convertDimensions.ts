import type { Breakpoints } from '@kiskadee/schema';

/**
 * Converts a font size key into a CSS media query rule.
 * For example, the key "fontSize--sm__12" returns:
 * @media (min-width: 320px) {
 *   .fontSize--sm__12 { font-size: 12px; }
 * }
 *
 * @param key - The font size key to process.
 * @param breakpoints - An object containing breakpoint definitions.
 * @returns The CSS rule as a string or null if the key doesn't match the expected pattern.
 */
export function convertDimensions(key: string, breakpoints: Breakpoints): string | null {
  // Check if the key starts with the expected prefix.
  if (!key.startsWith('fontSize--')) {
    return null;
  }

  // Remove the prefix "fontSize--" and split by "__" to separate the breakpoint and the value.
  const withoutPrefix = key.slice('fontSize--'.length);
  const parts = withoutPrefix.split('__');
  if (parts.length !== 2) {
    return null;
  }

  const [breakpointKey, sizeValue] = parts as [keyof Breakpoints, string];
  // Ensure the breakpoint exists.
  const breakpoint = breakpoints[breakpointKey];
  if (breakpoint === undefined) {
    return null;
  }

  // Optionally, you could validate that sizeValue is a valid number.
  const fontSize = Number(sizeValue);
  if (Number.isNaN(fontSize)) {
    return null;
  }

  // Generate a CSS rule wrapped in a media query based on the breakpoint value.
  return `
@media (min-width: ${breakpoint}px) {
  .${key} {
    font-size: ${fontSize}px;
  }
}`;
}
