import { describe, expect, it } from 'vitest';
import { transformTextAlignKeyToCss } from '../transformTextAlignKeyToCss';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../../errorMessages';

describe('transformTextAlignKeyToCss function', () => {
  describe('Valid Cases', () => {
    it('should generate the correct CSS rule for "left"', () => {
      const cssRule = transformTextAlignKeyToCss('textAlign__left');
      expect(cssRule).toBe('.textAlign__left { text-align: left; }');
    });

    it('should generate the correct CSS rule for "center"', () => {
      const cssRule = transformTextAlignKeyToCss('textAlign__center');
      expect(cssRule).toBe('.textAlign__center { text-align: center; }');
    });

    it('should generate the correct CSS rule for "right"', () => {
      const cssRule = transformTextAlignKeyToCss('textAlign__right');
      expect(cssRule).toBe('.textAlign__right { text-align: right; }');
    });

    it('should generate the correct CSS rule for "justify"', () => {
      const cssRule = transformTextAlignKeyToCss('textAlign__justify');
      expect(cssRule).toBe('.textAlign__justify { text-align: justify; }');
    });
  });

  describe('Error Cases', () => {
    it('should throw an error for unsupported alignment value', () => {
      expect(() => transformTextAlignKeyToCss('textAlign__top')).toThrowError(
        UNSUPPORTED_VALUE('textAlign', 'top', 'textAlign__top')
      );
    });

    it('should throw an error for an invalid prefix', () => {
      expect(() => transformTextAlignKeyToCss('alignText__center')).toThrowError(
        UNSUPPORTED_PROPERTY('textAlign', 'alignText__center')
      );
    });

    it('should throw an error for extra separators', () => {
      expect(() => transformTextAlignKeyToCss('textAlign__center__extra')).toThrowError();
    });

    it('should throw an error for missing separators', () => {
      expect(() => transformTextAlignKeyToCss('textAlign-center')).toThrowError();
    });
  });
});
