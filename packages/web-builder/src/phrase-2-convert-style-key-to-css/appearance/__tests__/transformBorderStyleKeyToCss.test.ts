import { describe, it, expect } from 'vitest';
import { transformBorderStyleToCss } from '../transformBorderStyleKeyToCss';

describe('transformBorderStyleToCss function', () => {
  describe('Successful operation', () => {
    it('should return a valid CSS string for border style "none"', () => {
      const borderStyle = 'none';
      const key = `borderStyle__${borderStyle}`;
      const expectedCss = `.${key} { border-style: ${borderStyle} }`;

      expect(transformBorderStyleToCss(key)).toBe(expectedCss);
    });

    it('should return a valid CSS string for border style "dotted"', () => {
      const borderStyle = 'dotted';
      const key = `borderStyle__${borderStyle}`;
      const expectedCss = `.${key} { border-style: ${borderStyle} }`;

      expect(transformBorderStyleToCss(key)).toBe(expectedCss);
    });

    it('should return a valid CSS string for border style "dashed"', () => {
      const borderStyle = 'dashed';
      const key = `borderStyle__${borderStyle}`;
      const expectedCss = `.${key} { border-style: ${borderStyle} }`;

      expect(transformBorderStyleToCss(key)).toBe(expectedCss);
    });

    it('should return a valid CSS string for border style "solid"', () => {
      const borderStyle = 'solid';
      const key = `borderStyle__${borderStyle}`;
      const expectedCss = `.${key} { border-style: ${borderStyle} }`;

      expect(transformBorderStyleToCss(key)).toBe(expectedCss);
    });
  });

  describe('Error handling', () => {
    it('should throw an error when key does not start with "borderStyle__"', () => {
      const invalidPrefix = 'invalidPrefix';
      const styleKey = `${invalidPrefix}__solid`;
      const expectedMessage = `Invalid style key "${styleKey}". Expected the key to be in the format "<property>__<value>" with the property part being "borderStyle__"`;

      expect(() => transformBorderStyleToCss(styleKey)).toThrowError(expectedMessage);
    });

    it('should throw an error when border style value is not supported', () => {
      const unsupportedValue = 'unsupported';
      const key = `borderStyle__${unsupportedValue}`;
      const expectedMessage = `Unsupported value "${unsupportedValue}" for property "borderStyle" in style key "${key}"`;

      expect(() => transformBorderStyleToCss(key)).toThrowError(expectedMessage);
    });
  });
});
