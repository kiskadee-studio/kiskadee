import { describe, expect, it } from 'vitest';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../../errorMessages';
import { transformBorderStyleKeyToCss } from './transformBorderStyleKeyToCss';

const propertyName = 'borderStyle';
const className = 'abc';

describe('transformBorderStyleKeyToCss', () => {
  describe('Successful operation', () => {
    it('returns expected CSS rule for "borderStyle__none"', () => {
      const styleKey = 'borderStyle__none';
      const result = transformBorderStyleKeyToCss(styleKey, className);

      expect(result).toEqual('.abc { border-style: none }');
      expect(result).toMatchSnapshot();
    });

    it('returns expected CSS rule for "borderStyle__dotted"', () => {
      const styleKey = 'borderStyle__dotted';
      const result = transformBorderStyleKeyToCss(styleKey, className);

      expect(result).toEqual('.abc { border-style: dotted }');
      expect(result).toMatchSnapshot();
    });

    it('returns expected CSS rule for "borderStyle__dashed"', () => {
      const styleKey = 'borderStyle__dashed';
      const result = transformBorderStyleKeyToCss(styleKey, className);

      expect(result).toEqual('.abc { border-style: dashed }');
      expect(result).toMatchSnapshot();
    });

    it('returns expected CSS rule for "borderStyle__solid"', () => {
      const styleKey = 'borderStyle__solid';
      const result = transformBorderStyleKeyToCss(styleKey, className);

      expect(result).toEqual('.abc { border-style: solid }');
      expect(result).toMatchSnapshot();
    });
  });

  describe('Error handling', () => {
    it('throws for unsupported property segment', () => {
      const badKey = 'invalidProperty__solid';
      const expectedError = UNSUPPORTED_PROPERTY('invalidProperty', badKey);

      expect(() => transformBorderStyleKeyToCss(badKey, className)).toThrowError(expectedError);
      expect(expectedError).toMatchSnapshot();
    });

    it('throws for unsupported value segment', () => {
      const badKey = `${propertyName}__unknownValue`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, 'unknownValue', badKey);

      expect(() => transformBorderStyleKeyToCss(badKey, className)).toThrowError(expectedError);
      expect(expectedError).toMatchSnapshot();
    });

    it('throws when value segment is missing', () => {
      const badKey = `${propertyName}`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, undefined as unknown as string, badKey);

      expect(() => transformBorderStyleKeyToCss(badKey, className)).toThrowError(expectedError);
      expect(expectedError).toMatchSnapshot();
    });

    it('throws when multiple value segments are provided', () => {
      const badKey = `${propertyName}__solid__extra`;
      const expectedError = UNSUPPORTED_VALUE(propertyName, 'solid__extra', badKey);

      expect(() => transformBorderStyleKeyToCss(badKey, className)).toThrowError(expectedError);
      expect(expectedError).toMatchSnapshot();
    });
  });
});
