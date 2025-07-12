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
      it('throws error if style key prefix is incorrect', () => {
        const invalidProperty = 'invalidProperty';
        const styleKey = `${invalidProperty}__underline`;
        const expectedMessage = UNSUPPORTED_PROPERTY(propertyName, styleKey);

        let caught: unknown;
        try {
          transformTextLineTypeKeyToCss(styleKey);
        } catch (err) {
          caught = err;
        }

        expect(caught).toBeInstanceOf(Error);
        const error = caught as Error;
        expect(error.message).toBe(expectedMessage);
        expect(error.message).toMatchSnapshot();
      });

      it('throws error if style key format is invalid', () => {
        const styleKey = 'textLineType-underline';
        const expectedMessage = UNSUPPORTED_PROPERTY(propertyName, styleKey);

        let caught: unknown;
        try {
          transformTextLineTypeKeyToCss(styleKey);
        } catch (err) {
          caught = err;
        }

        expect(caught).toBeInstanceOf(Error);
        const error = caught as Error;
        expect(error.message).toBe(expectedMessage);
        expect(error.message).toMatchSnapshot();
      });
    });

    describe('Unsupported value errors', () => {
      it('throws error if the value part is missing', () => {
        const styleKey = `${propertyName}__`;
        const expectedMessage = UNSUPPORTED_VALUE(propertyName, '', styleKey);

        let caught: unknown;
        try {
          transformTextLineTypeKeyToCss(styleKey);
        } catch (err) {
          caught = err;
        }

        expect(caught).toBeInstanceOf(Error);
        const error = caught as Error;
        expect(error.message).toBe(expectedMessage);
        expect(error.message).toMatchSnapshot();
      });

      it('throws error if value contains unexpected separators', () => {
        const invalidValue = 'underline__dotted';
        const styleKey = `${propertyName}__${invalidValue}`;
        const expectedMessage = UNSUPPORTED_VALUE(propertyName, invalidValue, styleKey);

        let caught: unknown;
        try {
          transformTextLineTypeKeyToCss(styleKey);
        } catch (err) {
          caught = err;
        }

        expect(caught).toBeInstanceOf(Error);
        const error = caught as Error;
        expect(error.message).toBe(expectedMessage);
        expect(error.message).toMatchSnapshot();
      });

      it('throws error if value is unsupported', () => {
        const invalidValue = 'overline';
        const styleKey = `${propertyName}__${invalidValue}`;
        const expectedMessage = UNSUPPORTED_VALUE(propertyName, invalidValue, styleKey);

        let caught: unknown;
        try {
          transformTextLineTypeKeyToCss(styleKey);
        } catch (err) {
          caught = err;
        }

        expect(caught).toBeInstanceOf(Error);
        const error = caught as Error;
        expect(error.message).toBe(expectedMessage);
        expect(error.message).toMatchSnapshot();
      });
    });
  });
});
