import { describe, expect, it } from 'vitest';
import { UNSUPPORTED_PROPERTY_NAME, UNSUPPORTED_VALUE } from '../../errorMessages';
import { transformTextFontKeyToCss } from './transformTextFontKeyToCss';

const className = 'abc';

describe('transformTextFontKeyToCss', () => {
  describe('Successful operation', () => {
    it('should return CSS for multiple families without quotes', () => {
      const key = 'textFont__["Arial","Helvetica"]';
      const result = transformTextFontKeyToCss(key, className);
      expect(result).toEqual('.abc { font-family: Arial, Helvetica }');
    });

    it('should quote families with spaces and keep generic unquoted', () => {
      const key = 'textFont__["Open Sans","serif"]';
      const result = transformTextFontKeyToCss(key, className);
      expect(result).toEqual('.abc { font-family: "Open Sans", serif }');
    });

    it('should keep hyphenated generic families unquoted', () => {
      const key = 'textFont__["Roboto","sans-serif"]';
      const result = transformTextFontKeyToCss(key, className);
      expect(result).toEqual('.abc { font-family: Roboto, sans-serif }');
    });
  });

  describe('Error handling', () => {
    it('should throw for invalid property prefix', () => {
      const key = 'fontText__["Arial"]';
      const call = (): string => transformTextFontKeyToCss(key, className);
      expect(call).toThrowError(UNSUPPORTED_PROPERTY_NAME('textFont', key));
    });

    it('should throw for malformed JSON value', () => {
      const key = 'textFont__notAJsonArray';
      const call = (): string => transformTextFontKeyToCss(key, className);
      expect(call).toThrowError(UNSUPPORTED_VALUE('textFont', 'notAJsonArray', key));
    });

    it('should throw for extra separators in key', () => {
      const key = 'textFont__["Arial"]__extra';
      const call = (): string => transformTextFontKeyToCss(key, className);
      expect(call).toThrowError(UNSUPPORTED_VALUE('textFont', '["Arial"]__extra', key));
    });

    it('should throw for empty value segment', () => {
      const key = 'textFont__';
      const call = (): string => transformTextFontKeyToCss(key, className);
      expect(call).toThrowError(UNSUPPORTED_VALUE('textFont', '', key));
    });

    it('should throw for non-array JSON', () => {
      const key = 'textFont__"Arial"';
      const call = (): string => transformTextFontKeyToCss(key, className);
      expect(call).toThrowError(UNSUPPORTED_VALUE('textFont', '"Arial"', key));
    });
  });
});
