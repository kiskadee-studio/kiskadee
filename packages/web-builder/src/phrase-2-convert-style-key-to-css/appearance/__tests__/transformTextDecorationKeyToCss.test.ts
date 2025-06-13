import { describe, it, expect } from 'vitest';
import { CssTextDecorationValue, type TextDecorationValue } from '@kiskadee/schema';
import { transformTextDecorationKeyToCss } from '../transformTextDecorationKeyToCss';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../../errorMessages';

const propertyName = 'textDecoration';
const { lineThrough, underline, none } = CssTextDecorationValue;

describe('transformTextDecorationKeyToCss function', () => {
  describe('Successful operation', () => {
    it('should return a GeneratedCss for text decoration "underline"', () => {
      const textDecorationValue: TextDecorationValue = 'underline';
      const styleKey = `${propertyName}__${textDecorationValue}`;
      const expectedRule = `.${styleKey} { text-decoration: ${underline}; }`;
      const result = transformTextDecorationKeyToCss(styleKey);

      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedRule
      });
    });

    it('should return a GeneratedCss for text decoration "lineThrough"', () => {
      const textDecorationValue: TextDecorationValue = 'lineThrough';
      const styleKey = `${propertyName}__${textDecorationValue}`;
      const expectedRule = `.${styleKey} { text-decoration: ${lineThrough}; }`;
      const result = transformTextDecorationKeyToCss(styleKey);

      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedRule
      });
    });

    it('should return a GeneratedCss for text decoration "none"', () => {
      const textDecorationValue: TextDecorationValue = 'none';
      const styleKey = `${propertyName}__${textDecorationValue}`;
      const expectedRule = `.${styleKey} { text-decoration: ${none}; }`;
      const result = transformTextDecorationKeyToCss(styleKey);

      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedRule
      });
    });
  });

  describe('Error handling', () => {
    it('should throw when key does not start with "textDecoration__"', () => {
      const invalidProperty = 'invalidProperty';
      const styleKey = `${invalidProperty}__underline`;
      const expectedError = UNSUPPORTED_PROPERTY(propertyName, styleKey);
      expect(() => transformTextDecorationKeyToCss(styleKey)).toThrowError(expectedError);
    });

    it('should throw when no decoration value is provided', () => {
      const styleKey = `${propertyName}__`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, '', styleKey);
      expect(() => transformTextDecorationKeyToCss(styleKey)).toThrowError(expectedError);
    });

    it('should throw when key contains extra separators', () => {
      const invalidValue = 'underline__dotted';
      const styleKey = `${propertyName}__${invalidValue}`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, invalidValue, styleKey);
      expect(() => transformTextDecorationKeyToCss(styleKey)).toThrowError(expectedError);
    });

    it('should throw when decoration value is unsupported', () => {
      const invalidValue = 'overline';
      const styleKey = `${propertyName}__${invalidValue}`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, invalidValue, styleKey);
      expect(() => transformTextDecorationKeyToCss(styleKey)).toThrowError(expectedError);
    });

    it('should throw when the key cannot be split correctly', () => {
      const styleKey = 'textDecoration-underline';
      const expectedError = UNSUPPORTED_PROPERTY(propertyName, styleKey);
      expect(() => transformTextDecorationKeyToCss(styleKey)).toThrowError(expectedError);
    });
  });
});
