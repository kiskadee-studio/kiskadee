import { describe, it, expect } from 'vitest';
import { transformTextWeightKeyToCss } from './transformTextWeightKeyToCss';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';
import type { TextWeightValue } from '@kiskadee/schema';

const propertyName = 'textWeight';

describe('transformTextWeightKeyToCss function', () => {
  describe('Successful operation', () => {
    it('should return a GeneratedCss for text weight "thin"', () => {
      const textWeightValue: TextWeightValue = 'thin';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCssRule = `.${styleKey} { font-weight: 100 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      expect(result).toEqual({ className: styleKey, cssRule: expectedCssRule });
    });

    it('should return a GeneratedCss for text weight "extraLight"', () => {
      const textWeightValue: TextWeightValue = 'extraLight';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCssRule = `.${styleKey} { font-weight: 200 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      expect(result).toEqual({ className: styleKey, cssRule: expectedCssRule });
    });

    it('should return a GeneratedCss for text weight "light"', () => {
      const textWeightValue: TextWeightValue = 'light';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCssRule = `.${styleKey} { font-weight: 300 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      expect(result).toEqual({ className: styleKey, cssRule: expectedCssRule });
    });

    it('should return a GeneratedCss for text weight "normal"', () => {
      const textWeightValue: TextWeightValue = 'normal';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCssRule = `.${styleKey} { font-weight: 400 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      expect(result).toEqual({ className: styleKey, cssRule: expectedCssRule });
    });

    it('should return a GeneratedCss for text weight "medium"', () => {
      const textWeightValue: TextWeightValue = 'medium';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCssRule = `.${styleKey} { font-weight: 500 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      expect(result).toEqual({ className: styleKey, cssRule: expectedCssRule });
    });

    it('should return a GeneratedCss for text weight "semiBold"', () => {
      const textWeightValue: TextWeightValue = 'semiBold';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCssRule = `.${styleKey} { font-weight: 600 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      expect(result).toEqual({ className: styleKey, cssRule: expectedCssRule });
    });

    it('should return a GeneratedCss for text weight "bold"', () => {
      const textWeightValue: TextWeightValue = 'bold';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCssRule = `.${styleKey} { font-weight: 700 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      expect(result).toEqual({ className: styleKey, cssRule: expectedCssRule });
    });

    it('should return a GeneratedCss for text weight "extraBold"', () => {
      const textWeightValue: TextWeightValue = 'extraBold';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCssRule = `.${styleKey} { font-weight: 800 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      expect(result).toEqual({ className: styleKey, cssRule: expectedCssRule });
    });

    it('should return a GeneratedCss for text weight "black"', () => {
      const textWeightValue: TextWeightValue = 'black';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCssRule = `.${styleKey} { font-weight: 900 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      expect(result).toEqual({ className: styleKey, cssRule: expectedCssRule });
    });
  });

  describe('Error handling', () => {
    it('should throw an error when the key does not start with "textWeight__"', () => {
      const invalidProperty = 'invalidProperty';
      const textWeightValue: TextWeightValue = 'bold';
      const styleKey = `${invalidProperty}__${textWeightValue}`;
      const expectedError = UNSUPPORTED_PROPERTY(propertyName, styleKey);
      const result = () => transformTextWeightKeyToCss(styleKey);

      expect(result).toThrowError(expectedError);
    });

    it('should throw an error when the value is not supported', () => {
      const unsupportedValue = 'unsupported' as TextWeightValue;
      const styleKey = `${propertyName}__${unsupportedValue}`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, unsupportedValue, styleKey);
      const result = () => transformTextWeightKeyToCss(styleKey);

      expect(result).toThrowError(expectedError);
    });
  });
});
