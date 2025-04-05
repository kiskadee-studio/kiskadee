import { describe, it, expect } from 'vitest';
import { transformBorderStyleToCss } from './transformBorderStyleKeyToCss';

describe('transformBorderStyleToCss function', () => {
  describe('Successful operation', () => {
    it('should return a valid CSS string for border style "none"', () => {
      const key = 'borderStyle__none';
      const expectedCss = '.borderStyle__none { border-style: none }';

      expect(transformBorderStyleToCss(key)).toBe(expectedCss);
    });

    it('should return a valid CSS string for border style "dotted"', () => {
      expect(transformBorderStyleToCss('borderStyle__dotted')).toBe(
        '.borderStyle__dotted { border-style: dotted }'
      );
    });

    it('should return a valid CSS string for border style "dashed"', () => {
      expect(transformBorderStyleToCss('borderStyle__dashed')).toBe(
        '.borderStyle__dashed { border-style: dashed }'
      );
    });

    it('should return a valid CSS string for border style "solid"', () => {
      expect(transformBorderStyleToCss('borderStyle__solid')).toBe(
        '.borderStyle__solid { border-style: solid }'
      );
    });
  });

  describe('Error handling', () => {
    it('should throw an error when key does not start with "borderStyle__"', () => {
      const invalidKey = 'invalidPrefix__solid';

      expect(() => transformBorderStyleToCss(invalidKey)).toThrowError(
        'Invalid format for key "invalidPrefix__solid". Expected key to start with "borderStyle__".'
      );
    });

    it('should throw an error when border style value is not supported', () => {
      const unsupportedValue = 'unsupported';
      const key = `borderStyle__${unsupportedValue}`;

      expect(() => transformBorderStyleToCss(key)).toThrowError(
        `Unsupported borderStyle value "unsupported" in key "${key}"`
      );
    });
  });
});
