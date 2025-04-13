import { describe, expect, it } from 'vitest';
import { convertTextAlign } from './convertTextAlign';
import { UNSUPPORTED_PROPERTY, UNSUPPORTED_VALUE } from '../errorMessages';

describe('convertTextAlign', () => {
  describe('Valid Cases', () => {
    it('should generate the correct CSS rule for "left"', () => {
      const cssRule = convertTextAlign('textAlign__left');
      expect(cssRule).toBe('.textAlign__left { text-align: left; }');
    });

    it('should generate the correct CSS rule for "center"', () => {
      const cssRule = convertTextAlign('textAlign__center');
      expect(cssRule).toBe('.textAlign__center { text-align: center; }');
    });

    it('should generate the correct CSS rule for "right"', () => {
      const cssRule = convertTextAlign('textAlign__right');
      expect(cssRule).toBe('.textAlign__right { text-align: right; }');
    });

    it('should generate the correct CSS rule for "justify"', () => {
      const cssRule = convertTextAlign('textAlign__justify');
      expect(cssRule).toBe('.textAlign__justify { text-align: justify; }');
    });
  });

  describe('Error Cases', () => {
    it('should throw an error for unsupported alignment value', () => {
      expect(() => convertTextAlign('textAlign__top')).toThrowError(
        UNSUPPORTED_VALUE('textAlign', 'top', 'textAlign__top')
      );
    });

    it('should throw an error for an invalid prefix', () => {
      expect(() => convertTextAlign('alignText__center')).toThrowError(
        UNSUPPORTED_PROPERTY('textAlign', 'alignText__center')
      );
    });

    it('should throw an error for extra separators', () => {
      expect(() => convertTextAlign('textAlign__center__extra')).toThrowError();
    });

    it('should throw an error for missing separators', () => {
      expect(() => convertTextAlign('textAlign-center')).toThrowError();
    });
  });
});
