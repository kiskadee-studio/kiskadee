import { CssBorderStyleValue } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';
import { transformBorderKeyToCss } from './transformBorderKeyToCss';

const propertyName = 'borderStyle';
const className = 'abc';

describe('transformBorderToCss', () => {
  describe('Successful operation', () => {
    for (const [keySuffix, cssValue] of Object.entries(CssBorderStyleValue)) {
      const styleKey = `${propertyName}__${keySuffix}`;

      it(`should return correct css rule for "${keySuffix}"`, () => {
        const result = transformBorderKeyToCss(styleKey, className);

        expect(result).toEqual(`.abc { border-style: ${cssValue} }`);
      });
    }
  });

  describe('Error handling', () => {
    it('should throw if the property segment is unsupported', () => {
      const badKey = 'invalidProperty__solid';
      const expectedError = UNSUPPORTED_PROPERTY('invalidProperty', badKey);
      expect(() => transformBorderKeyToCss(badKey, className)).toThrowError(expectedError);
    });

    it('should throw if the value is not supported', () => {
      const badKey = `${propertyName}__unknownValue`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, 'unknownValue', badKey);
      expect(() => transformBorderKeyToCss(badKey, className)).toThrowError(expectedError);
    });

    it('should throw if the value is missing (no value segment provided)', () => {
      const badKey = `${propertyName}`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, undefined as unknown as string, badKey);
      expect(() => transformBorderKeyToCss(badKey, className)).toThrowError(expectedError);
    });

    it('should throw if multiple value segments are provided', () => {
      const badKey = `${propertyName}__solid__extra`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, 'solid__extra', badKey);
      expect(() => transformBorderKeyToCss(badKey, className)).toThrowError(expectedError);
    });
  });
});
