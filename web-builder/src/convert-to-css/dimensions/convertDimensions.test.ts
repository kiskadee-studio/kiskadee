import { describe, expect, it } from 'vitest';
import { convertDimensions } from './convertDimensions';
import { breakpoints } from '@kiskadee/schema';

describe('convertDimensions', () => {
  describe('convertDimensions - Valid Properties (Unique Value)', () => {
    it("should convert 'textSize__16' into a valid CSS rule", () => {
      const result = convertDimensions('textSize__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.textSize__16 {');
      expect(result).toContain('font-size: 1rem');
    });

    it("should convert 'paddingTop__16' into a valid CSS rule", () => {
      const result = convertDimensions('paddingTop__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.paddingTop__16 {');
      expect(result).toContain('padding-top: 16px');
    });

    it("should convert 'marginLeft__16' into a valid CSS rule", () => {
      const result = convertDimensions('marginLeft__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.marginLeft__16 {');
      expect(result).toContain('margin-left: 16px');
    });

    it("should convert 'borderWidth__16' into a valid CSS rule", () => {
      const result = convertDimensions('borderWidth__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.borderWidth__16 {');
      expect(result).toContain('border-width: 16px');
    });

    it("should convert 'boxWidth__16' into a valid CSS rule", () => {
      const result = convertDimensions('boxWidth__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.boxWidth__16 {');
      expect(result).toContain('width: 16px');
    });

    it("should convert 'boxHeight__16' into a valid CSS rule", () => {
      const result = convertDimensions('boxHeight__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.boxHeight__16 {');
      expect(result).toContain('height: 16px');
    });
  });

  describe('convertDimensions - Valid Properties (Size Support)', () => {
    it("should convert 'textSize--s:sm:1__16' into a valid CSS rule", () => {
      const result = convertDimensions('textSize--s:sm:1__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.textSize__16 {');
      expect(result).toContain('font-size: 1rem');
    });

    it("should convert 'paddingTop--s:sm:1__16' into a valid CSS rule", () => {
      const result = convertDimensions('paddingTop--s:sm:1__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.paddingTop__16 {');
      expect(result).toContain('padding-top: 16px');
    });

    it("should convert 'marginLeft--s:sm:1__16' into a valid CSS rule", () => {
      const result = convertDimensions('marginLeft--s:sm:1__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.marginLeft__16 {');
      expect(result).toContain('margin-left: 16px');
    });

    it("should convert 'borderWidth--s:sm:1__16' into a valid CSS rule", () => {
      const result = convertDimensions('borderWidth--s:sm:1__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.borderWidth__16 {');
      expect(result).toContain('border-width: 16px');
    });

    it("should convert 'boxWidth--s:sm:1__16' into a valid CSS rule", () => {
      const result = convertDimensions('boxWidth--s:sm:1__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.width__16 {');
      expect(result).toContain('width: 16px');
    });

    it("should convert 'boxHeight--s:sm:1__16' into a valid CSS rule", () => {
      const result = convertDimensions('boxHeight--s:sm:1__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.height__16 {');
      expect(result).toContain('height: 16px');
    });
  });
});
