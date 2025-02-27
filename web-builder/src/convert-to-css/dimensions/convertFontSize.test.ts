// convertFontSize.test.ts
import { describe, expect, it } from 'vitest';
import { convertFontSize } from './convertFontSize';

describe('convertFontSize', () => {
  // Define a sample breakpoints object for testing.
  const breakpoints = {
    all: 0,
    sm1: 320,
    sm2: 360,
    sm3: 400,
    md1: 568,
    md2: 768,
    md3: 1024,
    lg1: 1152,
    lg2: 1312,
    lg3: 1792,
    lg4: 2432
  };

  it('should convert a valid simple fontSize key into a CSS rule without media query', () => {
    const key = 'fontSize--sm__12';
    const result = convertFontSize(key, breakpoints);

    // For plain keys, the class rule should be renamed by replacing '--' with '-'
    // and no media query wrapper is expected.
    expect(result).toContain('.fontSize-sm {');
    expect(result).toContain('font-size: 12px');
    expect(result).not.toContain('@media');
  });

  it('should convert a valid fontSize key with media query', () => {
    const key = 'fontSize--md::lg1__14';
    const result = convertFontSize(key, breakpoints);

    // The class name should be stripped to "fontSize-md"
    expect(result).toContain('.fontSize-md {');

    // The media query should use the breakpoint defined for "lg1"
    expect(result).toContain(`@media (min-width: ${breakpoints.lg1}px)`);
    expect(result).toContain('font-size: 14px');
  });

  it('should return null for a key with an invalid prefix', () => {
    const key = 'invalid--sm__12';
    const result = convertFontSize(key, breakpoints);
    expect(result).toBeNull();
  });

  it('should return null for a key that does not have the proper delimiter', () => {
    const key = 'fontSize--sm-12'; // Missing "__" or "::" delimiter.
    const result = convertFontSize(key, breakpoints);
    expect(result).toBeNull();
  });

  it('should return null if the font size value is not numeric', () => {
    const key = 'fontSize--sm__abc';
    const result = convertFontSize(key, breakpoints);
    expect(result).toBeNull();
  });

  it('should return null if the media query breakpoint key is not found in breakpoints', () => {
    const key = 'fontSize--md::invalid__14';
    const result = convertFontSize(key, breakpoints);
    expect(result).toBeNull();
  });
});
