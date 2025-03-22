import { describe, expect, it } from 'vitest';
import { convertTextAlign } from './convertTextAlign';

describe('convertTextAlign', () => {
  describe('convertTextAlign - Valid Values', () => {
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

  describe('convertTextAlign - Exceptions', () => {
    it('should return null for unsupported alignment values', () => {
      const cssRule = convertTextAlign('textAlign__top');
      expect(cssRule).toBeNull();
    });

    it('should return null for an invalid prefix', () => {
      const cssRule = convertTextAlign('alignText__center');
      expect(cssRule).toBeNull();
    });

    it('should return null for missing separators', () => {
      const cssRule = convertTextAlign('textAlign-center');
      expect(cssRule).toBeNull();
    });

    it('should return null for extra separators', () => {
      const cssRule = convertTextAlign('textAlign__center__extra');
      expect(cssRule).toBeNull();
    });
  });
});
