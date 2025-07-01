import { describe, it, expect } from 'vitest';
import {
  CssDecorationProperty,
  CssTextDecorationValue,
  type TextLineTypeProperty,
  type TextLineTypeValue
} from '@kiskadee/schema';
import { transformTextLineTypeKeyToCss } from './transformTextLineTypeKeyToCss';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

const propertyName: TextLineTypeProperty = 'textLineType';
const { textLineType } = CssDecorationProperty;
const { lineThrough, underline, none } = CssTextDecorationValue;

describe('transformTextLineTypeKeyToCss', () => {
  describe('Successful operation', () => {
    it('should return CSS for text line type "underline"', () => {
      const textLineTypeValue: TextLineTypeValue = 'underline';
      const styleKey = `${propertyName}__${textLineTypeValue}`;
      const expectedRule = `.${styleKey} { ${textLineType}: ${underline}; }`;
      const result = transformTextLineTypeKeyToCss(styleKey);

      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedRule
      });
      expect(result).toMatchSnapshot();
    });

    it('should return CSS for text line type "lineThrough"', () => {
      const textLineTypeValue: TextLineTypeValue = 'lineThrough';
      const styleKey = `${propertyName}__${textLineTypeValue}`;
      const expectedRule = `.${styleKey} { ${textLineType}: ${lineThrough}; }`;
      const result = transformTextLineTypeKeyToCss(styleKey);

      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedRule
      });
      expect(result).toMatchSnapshot();
    });

    it('should return CSS for text line type "none"', () => {
      const textLineTypeValue: TextLineTypeValue = 'none';
      const styleKey = `${propertyName}__${textLineTypeValue}`;
      const expectedRule = `.${styleKey} { ${textLineType}: ${none}; }`;
      const result = transformTextLineTypeKeyToCss(styleKey);

      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedRule
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('Error handling', () => {
    describe('Unsupported property errors', () => {
      it('should throw when style key does not start with "textLineType__"', () => {
        const invalidProperty = 'invalidProperty';
        const styleKey = `${invalidProperty}__underline`;
        const expectedError = UNSUPPORTED_PROPERTY(propertyName, styleKey);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowError(expectedError);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowErrorMatchingSnapshot();
      });

      it('should throw when the key cannot be split correctly', () => {
        const styleKey = 'textLineType-underline';
        const expectedError = UNSUPPORTED_PROPERTY(propertyName, styleKey);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowError(expectedError);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowErrorMatchingSnapshot();
      });
    });

    describe('Unsupported value errors', () => {
      it('should throw when no text line type value is provided', () => {
        const styleKey = `${propertyName}__`;
        const expectedError = UNSUPPORTED_VALUE(propertyName, '', styleKey);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowError(expectedError);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowErrorMatchingSnapshot();
      });

      it('should throw when style key contains extra separators', () => {
        const invalidValue = 'underline__dotted';
        const styleKey = `${propertyName}__${invalidValue}`;
        const expectedError = UNSUPPORTED_VALUE(propertyName, invalidValue, styleKey);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowError(expectedError);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowErrorMatchingSnapshot();
      });

      it('should throw when text line type value is unsupported', () => {
        const invalidValue = 'overline';
        const styleKey = `${propertyName}__${invalidValue}`;
        const expectedError = UNSUPPORTED_VALUE(propertyName, invalidValue, styleKey);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowError(expectedError);
        expect(() => transformTextLineTypeKeyToCss(styleKey)).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
