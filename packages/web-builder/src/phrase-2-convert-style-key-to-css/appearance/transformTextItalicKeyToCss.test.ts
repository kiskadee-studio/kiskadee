import { describe, expect, it } from 'vitest';
import { transformTextItalicKeyToCss } from './transformTextItalicKeyToCss';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';
import { CSSTextItalicValue } from '@kiskadee/schema';

const textItalicProperty = 'textItalic';

describe('transformTextItalicKeyToCss function', () => {
  describe('Successful operation', () => {
    it('should return a GeneratedCss for italic text "true"', () => {
      const textItalicValue = CSSTextItalicValue.true;
      const styleKey = `${textItalicProperty}__${textItalicValue}`;

      const result = transformTextItalicKeyToCss(styleKey);
      const expectedCssRule = `.${styleKey} { font-style: italic; }`;

      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
    });

    it('should return a GeneratedCss for italic text "false"', () => {
      const textItalicValue = CSSTextItalicValue.false;
      const styleKey = `${textItalicProperty}__${textItalicValue}`;

      const result = transformTextItalicKeyToCss(styleKey);
      const expectedCssRule = `.${styleKey} { font-style: normal; }`;

      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
    });
  });

  describe('Error handling', () => {
    it('should throw an error for style keys that do not start with "textItalic__"', () => {
      const invalidProperty = 'notTextItalic';
      const textItalicValue = CSSTextItalicValue.true;
      const styleKey = `${invalidProperty}__${textItalicValue}`;
      const expectedMessage = UNSUPPORTED_PROPERTY(textItalicProperty, styleKey);
      const result = () => transformTextItalicKeyToCss(styleKey);

      expect(result).toThrowError(expectedMessage);
    });

    it('should throw an error for style keys that are not correctly separated', () => {
      const styleKey = 'textItalictrue';
      const expectedMessage = UNSUPPORTED_PROPERTY(textItalicProperty, styleKey);
      const result = () => transformTextItalicKeyToCss(styleKey);

      expect(result).toThrowError(expectedMessage);
    });

    it('should throw an error for unsupported values', () => {
      const invalidValue = 'center';
      const styleKey = `${textItalicProperty}__${invalidValue}`;
      const expectedMessage = UNSUPPORTED_VALUE(textItalicProperty, invalidValue, styleKey);
      const result = () => transformTextItalicKeyToCss(styleKey);

      expect(result).toThrowError(expectedMessage);
    });

    it('should throw an error for keys with extra segments', () => {
      const validValue = CSSTextItalicValue.true;
      const extraSegment = 'extra';
      const styleKey = `${textItalicProperty}__${validValue}__${extraSegment}`;
      const expectedMessage = UNSUPPORTED_VALUE(
        textItalicProperty,
        `${validValue}__${extraSegment}`,
        styleKey
      );
      const transform = () => transformTextItalicKeyToCss(styleKey);

      expect(transform).toThrowError(expectedMessage);
    });

    it('should throw an error for keys with empty value segment', () => {
      const key = 'textItalic__';
      const expectedMessage = UNSUPPORTED_VALUE(textItalicProperty, '', key);
      const transform = () => transformTextItalicKeyToCss(key);

      expect(transform).toThrowError(expectedMessage);
    });

    it('should throw an error for an empty style key', () => {
      const styleKey = '';
      const expectedMessage = UNSUPPORTED_PROPERTY(textItalicProperty, styleKey);
      const transform = () => transformTextItalicKeyToCss(styleKey);

      expect(transform).toThrowError(expectedMessage);
    });
  });
});
