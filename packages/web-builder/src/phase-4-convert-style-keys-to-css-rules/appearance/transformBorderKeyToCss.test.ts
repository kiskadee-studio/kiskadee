import { describe, it, expect } from 'vitest';
import { CssBorderStyleValue } from '@kiskadee/schema';
import { transformBorderKeyToCss } from './transformBorderKeyToCss';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

const propertyName = 'borderStyle';

describe('transformBorderToCss function', () => {
  describe('Successful operation', () => {
    for (const [keySuffix, cssValue] of Object.entries(CssBorderStyleValue)) {
      const styleKey = `${propertyName}__${keySuffix}` as const;
      const expected = {
        className: styleKey,
        cssRule: `.${styleKey} { border-style: ${cssValue} }`
      };

      it(`should return correct className and cssRule for "${keySuffix}"`, () => {
        const result = transformBorderKeyToCss(styleKey);
        expect(result).toEqual(expected);
      });
    }
  });

  describe('Error handling', () => {
    it('should throw if the key does not start with the expected prefix', () => {
      const badKey = 'invalidPrefix__solid';
      const expectedError = UNSUPPORTED_PROPERTY(`${propertyName}__`, badKey);
      expect(() => transformBorderKeyToCss(badKey)).toThrowError(expectedError);
    });

    it('should throw if the value is not supported', () => {
      const badKey = `${propertyName}__unknownValue`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, 'unknownValue', badKey);
      expect(() => transformBorderKeyToCss(badKey)).toThrowError(expectedError);
    });
  });
});
