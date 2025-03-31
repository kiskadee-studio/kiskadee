import { describe, it, expect } from 'vitest';
import { transformBorderStyleToCss } from './transformBorderStyleKeyToCss';
import { borderStyleValues } from '@kiskadee/schema';

describe('transformBorderStyleToCss', () => {
  // Test for valid keys
  it('should return a valid CSS string for a valid border style key', () => {
    for (const value of borderStyleValues) {
      const key = `borderStyle__${value}`;
      const expectedCss = `.${key} { border-style: ${value} }`;
      expect(transformBorderStyleToCss(key)).toBe(expectedCss);
    }
  });

  // Test for invalid key prefix
  it('should throw an error when key does not start with "borderStyle__"', () => {
    const invalidKey = 'invalidPrefix__solid';
    expect(() => transformBorderStyleToCss(invalidKey)).toThrowError(
      'Invalid format. Expected key to start with "borderStyle__".'
    );
  });

  // Test for an unsupported border style value
  it('should throw an error when border style value is not supported', () => {
    const unsupportedValue = 'unsupported';
    const key = `borderStyle__${unsupportedValue}`;
    expect(() => transformBorderStyleToCss(key)).toThrowError(
      `Unsupported borderStyle value: ${unsupportedValue}`
    );
  });
});
