import { describe, it, expect } from 'vitest';
import { transformTextWeightKeyToCss } from './transformTextWeightKeyToCss';
import { INVALID_KEY_PREFIX, UNSUPPORTED_VALUE } from '../errorMessages';

describe('transformTextWeightKeyToCss function', () => {
  describe('Successful operation', () => {
    it('should return a valid CSS string for text weight "bold"', () => {
      const weightValue = 'bold';
      const key = `textWeight__${weightValue}`;
      const expectedCss = `.${key} { font-weight: 700 }`;
      const result = transformTextWeightKeyToCss(key);

      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "normal"', () => {
      const weightValue = 'normal';
      const key = `textWeight__${weightValue}`;
      const expectedCss = `.${key} { font-weight: 400 }`;
      const result = transformTextWeightKeyToCss(key);

      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "light"', () => {
      const weightValue = 'light';
      const key = `textWeight__${weightValue}`;
      const expectedCss = `.${key} { font-weight: 300 }`;
      const result = transformTextWeightKeyToCss(key);

      expect(result).toBe(expectedCss);
    });
  });

  describe('Error handling', () => {
    it('should throw an error when the key does not start with "textWeight__"', () => {
      const invalidPrefix = 'invalidPrefix';
      const weightValue = 'bold';
      const key = `${invalidPrefix}__${weightValue}`;
      const expectedError = INVALID_KEY_PREFIX('textWeight__', key);
      const result = () => transformTextWeightKeyToCss(key);

      expect(result).toThrowError(expectedError);
    });

    it('should throw an error when the text weight value is not supported', () => {
      const unsupportedValue = 'unknown';
      const key = `textWeight__${unsupportedValue}`;
      const expectedError = UNSUPPORTED_VALUE('textWeight', unsupportedValue, key);
      const result = () => transformTextWeightKeyToCss(key);

      expect(result).toThrowError(expectedError);
    });
  });
});
