import { describe, expect, it } from 'vitest';
import { convertFontStyle } from './convertTextStyle';

describe('convertFontStyle', () => {
  describe('convertFontStyle - Valid Values', () => {
    it('should generate the correct CSS rule for "true" (italic)', () => {
      const cssRule = convertFontStyle('textItalic__true');
      expect(cssRule).toBe('.textItalic__true { font-style: italic; }');
    });

    it('should generate the correct CSS rule for "false" (normal)', () => {
      const cssRule = convertFontStyle('textItalic__false');
      expect(cssRule).toBe('.textItalic__false { font-style: normal; }');
    });
  });

  describe('convertFontStyle - Exceptions', () => {
    it('should return null for keys that do not start with "textItalic__"', () => {
      const cssRule = convertFontStyle('notTextItalic__true');
      expect(cssRule).toBeNull();
    });

    it('should return null for keys that cannot be split correctly', () => {
      const cssRule = convertFontStyle('textItalictrue');
      expect(cssRule).toBeNull();
    });

    it('should return null for invalid values', () => {
      const cssRule = convertFontStyle('textItalic__center');
      expect(cssRule).toBeNull();
    });
  });
});
