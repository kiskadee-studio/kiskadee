import { describe, it, expect } from 'vitest';
import { CssTextDecorationValue, type TextDecorationValue } from 'schema/src';
import { transformTextDecorationKeyToCss } from '../transformTextDecorationKeyToCss';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../../errorMessages';

const propertyName = 'textDecoration';
const { lineThrough, underline, none } = CssTextDecorationValue;

describe('transformTextDecorationKeyToCss function', () => {
  describe('Successful operation', () => {
    it('should return a valid CSS string for text decoration "underline"', () => {
      const textDecorationValue: TextDecorationValue = 'underline';
      const styleKey = `${propertyName}__${textDecorationValue}`;
      const expectedCss = `.${styleKey} { text-decoration: ${underline}; }`;
      const result = transformTextDecorationKeyToCss(styleKey);

      // input: textDecoration__underline
      // output: .textDecoration__underline { text-decoration: underline; }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text decoration "lineThrough"', () => {
      const textDecorationValue: TextDecorationValue = 'lineThrough';
      const styleKey = `${propertyName}__${textDecorationValue}`;
      const expectedCss = `.${styleKey} { text-decoration: ${lineThrough}`;
      const result = transformTextDecorationKeyToCss(styleKey);

      // input: textDecoration__lineThrough
      // output: .textDecoration__lineThrough { text-decoration: line-through; }
      expect(result).toBe(expectedCss);
    });

    it('should return a valid CSS string for text decoration "none"', () => {
      const textDecorationValue: TextDecorationValue = 'none';
      const styleKey = `${propertyName}__${textDecorationValue}`;
      const expectedCss = `.${styleKey} { text-decoration: ${none}; }`;
      const result = transformTextDecorationKeyToCss(styleKey);

      // input: textDecoration__none
      // output: .textDecoration__none { text-decoration: none; }
      expect(result).toBe(expectedCss);
    });
  });

  describe('Error handling', () => {
    it('should throw an error when the key does not start with "textDecoration__"', () => {
      const invalidProperty = 'invalidProperty';
      const textDecorationValue: TextDecorationValue = 'underline';
      const styleKey = `${invalidProperty}__${textDecorationValue}`;
      const expectedError = UNSUPPORTED_PROPERTY(propertyName, styleKey);
      const result = () => transformTextDecorationKeyToCss(styleKey);

      // input: invalidProperty__underline
      // output: Invalid style key "invalidProperty__underline". Expected the key to be in the format "<property>__<value>" with the property part being "textDecoration".
      expect(result).toThrowError(expectedError);
    });

    it('should throw an error when no decoration value is provided', () => {
      const textDecorationValue = '';
      const styleKey = `${propertyName}__${textDecorationValue}`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, textDecorationValue, styleKey);
      const result = () => transformTextDecorationKeyToCss(styleKey);

      // input: textDecoration__
      // output: Unsupported value "" for property "textDecoration" in style key "textDecoration".
      expect(result).toThrowError(expectedError);
    });

    it('should throw an error when the style key contains more than one separator', () => {
      const invalidValue = 'underline__dotted';
      const styleKey = `${propertyName}__${invalidValue}`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, invalidValue, styleKey);
      const result = () => transformTextDecorationKeyToCss(styleKey);

      // input: textDecoration__underline__dotted
      // output: Unsupported value "underline__dotted" for property "textDecoration" in style key "textDecoration__underline__dotted".
      expect(result).toThrowError(expectedError);
    });

    it('should throw an error when the decoration value is not supported', () => {
      const invalidValue = 'overline';
      const styleKey = `${propertyName}__${invalidValue}`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, invalidValue, styleKey);
      const result = () => transformTextDecorationKeyToCss(styleKey);

      // input: textDecoration__overline
      // output: Unsupported value "overline" for property "textDecoration" in style key "textDecoration__overline".
      expect(result).toThrowError(expectedError);
    });

    it('should throw an error when the key cannot be split correctly', () => {
      const styleKey = 'textDecoration-underline';
      const expectedError = UNSUPPORTED_PROPERTY(propertyName, styleKey);
      const result = () => transformTextDecorationKeyToCss(styleKey);

      // input: textDecoration-underline
      // output: Invalid style key "textDecoration-underline". Expected the key to be in the format "<property>__<value>" with the property part being "textDecoration".
      expect(result).toThrowError(expectedError);
    });
  });
});
