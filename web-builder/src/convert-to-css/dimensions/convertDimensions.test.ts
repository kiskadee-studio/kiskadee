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

  describe('convertDimensions - Valid Properties (Media Query Support)', () => {
    it("should convert 'paddingTop--s:sm:1::bp:lg:1__16' into a valid CSS rule with media query", () => {
      const result = convertDimensions('paddingTop--s:sm:1::bp:lg:1__16', breakpoints);
      expect(result).toBeTruthy();

      // Retrieve the breakpoint value for the media token.
      // The token should match exactly what is provided (e.g. "bp:lg:1")
      const bpValue = breakpoints['bp:lg:1'];
      expect(bpValue).toBeDefined();
      expect(result).toContain(`@media (min-width: ${bpValue}px)`);

      // Based on the conversion logic, the custom size token is dropped so that the
      // resulting class name contains only the base property and a simplified breakpoint modifier.
      // For "paddingTop", the converted class name should be: ".paddingTop--lg1__16".
      expect(result).toContain('.paddingTop--lg1__16');

      // Checks that the CSS rule contains the correct property and value.
      expect(result).toContain('padding-top: 16px');
    });

    it("should convert 'textSize--s:sm:1::bp:lg:1__16' into a valid CSS rule with media query and rem unit", () => {
      const result = convertDimensions('textSize--s:sm:1::bp:lg:1__16', breakpoints);
      expect(result).toBeTruthy();

      // Retrieve the breakpoint value for the media token.
      const bpValue = breakpoints['bp:lg:1'];
      expect(bpValue).toBeDefined();
      expect(result).toContain(`@media (min-width: ${bpValue}px)`);

      // For "textSize" the logic converts the value to rem.
      // The resulting class name should be: ".textSize--lg1__16"
      expect(result).toContain('.textSize--lg1__16');
      // 16px should be converted to 1rem (16 / 16)
      expect(result).toContain('font-size: 1rem');
    });
  });

  describe('convertDimensions - Exception Scenarios', () => {
    it('Exception 1 - should return null when no matching dimension key is found', () => {
      const result = convertDimensions('invalidKey--s:sm:1::bp:lg:1__16', breakpoints);
      expect(result).toBeNull();
    });

    it('Exception 2 - should return null when the media query pattern has too many parts', () => {
      const result = convertDimensions('textSize--s:sm:1::bp:lg:1__16__extra', breakpoints);
      expect(result).toBeNull();
    });

    it('Exception 3 - should return null when the media query token format is invalid', () => {
      const result = convertDimensions('textSize--s:sm:1::lg:1__16', breakpoints);
      expect(result).toBeNull();
    });

    it('Exception 4 - should return null when the custom token is not a valid size prop', () => {
      const result = convertDimensions('paddingTop--foo::bp:lg:1__16', breakpoints);
      expect(result).toBeNull();
    });

    describe('Exception 7', () => {
      it('should return null when the custom token is missing in the non-media pattern', () => {
        const result = convertDimensions('paddingTop--__16', breakpoints);
        expect(result).toBeNull();
      });

      it('should return null when the value portion is missing in the non-media pattern', () => {
        const result = convertDimensions('paddingTop--s:__', breakpoints);
        expect(result).toBeNull();
      });
      it('should return null when the key lacks the "__" separator in the non-media pattern', () => {
        const result = convertDimensions('paddingTop--s:sm:1', breakpoints);
        expect(result).toBeNull();
      });
    });

    describe('Exception 8', () => {
      it('should return null when the custom token is only whitespace in the non-media pattern', () => {
        const result = convertDimensions('paddingTop--   __16', breakpoints);
        expect(result).toBeNull();
      });

      it('should return null when the breakpoint token is not defined in breakpoints', () => {
        const result = convertDimensions('textSize--s:bp:unknown:1__16', breakpoints);
        expect(result).toBeNull();
      });

      it('should return null when the custom token is invalid', () => {
        const result = convertDimensions('textSize--invalid:bp:lg:1__16', breakpoints);
        expect(result).toBeNull();
      });
    });
  });
});
