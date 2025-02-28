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

    it("should convert 'width__16' into a valid CSS rule", () => {
      const result = convertDimensions('width__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.width__16 {');
      expect(result).toContain('width: 16px');
    });

    it("should convert 'height__16' into a valid CSS rule", () => {
      const result = convertDimensions('height__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.height__16 {');
      expect(result).toContain('height: 16px');
    });
  });

  describe('convertDimensions - Valid Properties (Size Support)', () => {
    it("should convert 'textSize--sm__16' into a valid CSS rule", () => {
      const result = convertDimensions('textSize--sm__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.textSize-sm {');
      expect(result).toContain('font-size: 1rem');
    });

    it("should convert 'paddingTop--sm__16' into a valid CSS rule", () => {
      const result = convertDimensions('paddingTop--sm__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.paddingTop-sm {');
      expect(result).toContain('padding-top: 16px');
    });

    it("should convert 'marginLeft--sm__16' into a valid CSS rule", () => {
      const result = convertDimensions('marginLeft--sm__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.marginLeft-sm {');
      expect(result).toContain('margin-left: 16px');
    });

    it("should convert 'borderWidth--sm__16' into a valid CSS rule", () => {
      const result = convertDimensions('borderWidth--sm__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.borderWidth-sm {');
      expect(result).toContain('border-width: 16px');
    });

    it("should convert 'width--sm__16' into a valid CSS rule", () => {
      const result = convertDimensions('width--sm__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.width-sm {');
      expect(result).toContain('width: 16px');
    });

    it("should convert 'height--sm__16' into a valid CSS rule", () => {
      const result = convertDimensions('height--sm__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.height-sm {');
      expect(result).toContain('height: 16px');
    });
  });

  describe('convertDimensions - Valid Properties (Media Query Conversion)', () => {
    it("should convert 'textSize--sm::md1__16' into a valid CSS rule", () => {
      const result = convertDimensions('textSize--sm::md1__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('@media (min-width: 568px)');
      expect(result).toContain('.textSize-sm {');
      expect(result).toContain('font-size: 1rem');
    });

    it("should convert 'paddingTop--sm::lg1__16' into a valid CSS rule", () => {
      const result = convertDimensions('paddingTop--sm::lg1__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('@media (min-width: 1152px)');
      expect(result).toContain('.paddingTop-sm {');
      expect(result).toContain('padding-top: 16px');
    });

    it("should convert 'marginLeft--sm::lg2__16' into a valid CSS rule", () => {
      const result = convertDimensions('marginLeft--sm::lg2__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('@media (min-width: 1312px)');
      expect(result).toContain('.marginLeft-sm {');
      expect(result).toContain('margin-left: 16px');
    });

    it("should convert 'borderWidth--sm::lg3__16' into a valid CSS rule", () => {
      const result = convertDimensions('borderWidth--sm::lg3__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('@media (min-width: 1792px)');
      expect(result).toContain('.borderWidth-sm {');
      expect(result).toContain('border-width: 16px');
    });

    it("should convert 'width--sm::lg4__16' into a valid CSS rule", () => {
      const result = convertDimensions('width--sm::lg4__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('@media (min-width: 2432px)');
      expect(result).toContain('.width-sm {');
      expect(result).toContain('width: 16px');
    });

    it("should convert 'height--sm::sm1__16' into a valid CSS rule", () => {
      const result = convertDimensions('height--sm::sm1__16', breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('@media (min-width: 320px)');
      expect(result).toContain('.height-sm {');
      expect(result).toContain('height: 16px');
    });
  });
});
