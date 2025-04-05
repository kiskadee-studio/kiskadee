import { describe, it, expect } from 'vitest';
import { transformTextWeightKeyToCss } from './transformTextWeightKeyToCss';
import { INVALID_KEY_PREFIX, UNSUPPORTED_VALUE } from '../errorMessages';

describe('transformTextWeightKeyToCss function', () => {
  describe('Successful operation', () => {
    it('should return a valid CSS string for text weight "bold"', () => {
      const result = transformTextWeightKeyToCss('textWeight__bold');
      expect(result).toBe('.textWeight__bold { font-weight: 700 }');
    });

    it('should return a valid CSS string for text weight "normal"', () => {
      const result = transformTextWeightKeyToCss('textWeight__normal');
      expect(result).toBe('.textWeight__normal { font-weight: 400 }');
    });

    it('should return a valid CSS string for text weight "light"', () => {
      const result = transformTextWeightKeyToCss('textWeight__light');
      expect(result).toBe('.textWeight__light { font-weight: 300 }');
    });
  });

  describe('Error handling', () => {
    it('should throw an error when the key does not start with "textWeight__"', () => {
      const key = 'invalidPrefix__bold';
      expect(() => transformTextWeightKeyToCss(key)).toThrowError(
        INVALID_KEY_PREFIX('textWeight__', key)
      );
    });

    it('should throw an error when the text weight value is not supported', () => {
      const key = 'textWeight__unknown';
      expect(() => transformTextWeightKeyToCss(key)).toThrowError(
        UNSUPPORTED_VALUE('textWeight', 'unknown', key)
      );
    });
  });
});
