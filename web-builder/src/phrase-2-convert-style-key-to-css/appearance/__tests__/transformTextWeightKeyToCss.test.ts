import { describe, it, expect } from 'vitest';
import { transformTextWeightKeyToCss } from '../transformTextWeightKeyToCss';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../../errorMessages';
import type { TextWeightValue } from 'schema/src';

const propertyName = 'textWeight';

describe('transformTextWeightKeyToCss function', () => {
  describe('Successful operation', () => {
    it('should return a valid CSS string for text weight "thin"', () => {
      const textWeightValue: TextWeightValue = 'thin';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCss = `.${styleKey} { font-weight: 100 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      // input: textWeight__thin
      // output: .textWeight__thin { font-weight: 100 }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "extraLight"', () => {
      const textWeightValue: TextWeightValue = 'extraLight';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCss = `.${styleKey} { font-weight: 200 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      // input: textWeight__extraLight
      // output: .textWeight__extraLight { font-weight: 200 }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "light"', () => {
      const textWeightValue: TextWeightValue = 'light';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCss = `.${styleKey} { font-weight: 300 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      // input: textWeight__light
      // output: .textWeight__light { font-weight: 300 }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "normal"', () => {
      const textWeightValue: TextWeightValue = 'normal';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCss = `.${styleKey} { font-weight: 400 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      // input: textWeight__normal
      // output: .textWeight__normal { font-weight: 400 }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "medium"', () => {
      const textWeightValue: TextWeightValue = 'medium';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCss = `.${styleKey} { font-weight: 500 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      // input: textWeight__medium
      // output: .textWeight__medium { font-weight: 500 }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "semiBold"', () => {
      const textWeightValue: TextWeightValue = 'semiBold';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCss = `.${styleKey} { font-weight: 600 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      // input: textWeight__semiBold
      // output: .textWeight__semiBold { font-weight: 600 }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "bold"', () => {
      const textWeightValue: TextWeightValue = 'bold';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCss = `.${styleKey} { font-weight: 700 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      // input: textWeight__bold
      // output: .textWeight__bold { font-weight: 700 }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "extraBold"', () => {
      const textWeightValue: TextWeightValue = 'extraBold';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCss = `.${styleKey} { font-weight: 800 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      // input: textWeight__extraBold
      // output: .textWeight__extraBold { font-weight: 800 }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text weight "black"', () => {
      const textWeightValue: TextWeightValue = 'black';
      const styleKey = `${propertyName}__${textWeightValue}`;
      const expectedCss = `.${styleKey} { font-weight: 900 }`;
      const result = transformTextWeightKeyToCss(styleKey);

      // input: textWeight__black
      // output: .textWeight__black { font-weight: 900 }
      expect(result).toBe(expectedCss);
    });
  });

  describe('Error handling', () => {
    it('should throw an error when the key does not start with "textWeight__"', () => {
      const invalidProperty = 'invalidProperty';
      const textWeightValue: TextWeightValue = 'bold';
      const styleKey = `${invalidProperty}__${textWeightValue}`;
      const expectedError = UNSUPPORTED_PROPERTY(propertyName, styleKey);
      const result = () => transformTextWeightKeyToCss(styleKey);

      /*
        input: invalidProperty__bold
        output: Invalid style key "invalidProperty__bold". Expected the key to be in the format "<property>__<value>" with the property part being "textWeight".
      */
      expect(result).toThrowError(expectedError);
    });

    it('should throw an error when the text weight value is not supported', () => {
      const unsupportedValue = 'unknown';
      const styleKey = `${propertyName}__${unsupportedValue}`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, unsupportedValue, styleKey);
      const result = () => transformTextWeightKeyToCss(styleKey);

      /*
        input: textWeight__unknown
        output: Unsupported value "unknown" for property "textWeight" in style key "textWeight__unknown".
      */
      expect(result).toThrowError(expectedError);
    });
  });
});
