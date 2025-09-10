import { describe, expect, it } from 'vitest';
import {
  ERROR_INVALID_CUSTOM_TOKEN,
  ERROR_INVALID_KEY_FORMAT,
  ERROR_INVALID_MEDIA_QUERY_PATTERN,
  ERROR_INVALID_MEDIA_TOKEN,
  ERROR_INVALID_STANDARD_PATTERN,
  ERROR_MISSING_VALUE,
  ERROR_NO_MATCHING_DIMENSION_KEY,
  ERROR_NO_STANDARD_DIMENSION_KEY,
  transformDimensionKeyToCss
} from './transformDimensionKeyToCss';
import { breakpoints } from '@kiskadee/schema';

describe('transformDimensionKeyToCss', () => {
  describe('Successful operation', () => {
    describe('Valid Properties (Unique Value)', () => {
      it("should convert 'textSize__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('textSize__16', breakpoints);

        expect(result).toContain('.textSize__16 {');
        expect(result).toContain('font-size: 1rem');
      });

      it("should convert 'paddingTop__16' into a valid CSS rule", () => {
        const result = transformScaleKeyToCss('paddingTop__16', breakpoints);

        expect(result).toContain('.paddingTop__16 {');
        expect(result).toContain('padding-top: 16px');
      });

      it("should convert 'marginLeft__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('marginLeft__16', breakpoints);

        expect(result).toContain('.marginLeft__16 {');
        expect(result).toContain('margin-left: 16px');
      });

      it("should convert 'borderWidth__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('borderWidth__16', breakpoints);

        expect(result).toContain('.borderWidth__16 {');
        expect(result).toContain('border-width: 16px');
      });

      it("should convert 'boxWidth__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('boxWidth__16', breakpoints);

        expect(result).toContain('.boxWidth__16 {');
        expect(result).toContain('width: 16px');
      });

      it("should convert 'boxHeight__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('boxHeight__16', breakpoints);

        expect(result).toContain('.boxHeight__16 {');
        expect(result).toContain('height: 16px');
      });
    });

    describe('Valid Properties (Size Support)', () => {
      it("should convert 'textSize--s:sm:1__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('textSize--s:sm:1__16', breakpoints);

        expect(result).toContain('.textSize__16 {');
        expect(result).toContain('font-size: 1rem');
      });

      it("should convert 'paddingRight--s:sm:1__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('paddingRight--s:sm:1__16', breakpoints);

        expect(result).toContain('.paddingRight__16 {');
        expect(result).toContain('padding-right: 16px');
      });

      it("should convert 'marginLeft--s:sm:1__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('marginLeft--s:sm:1__16', breakpoints);

        expect(result).toContain('.marginLeft__16 {');
        expect(result).toContain('margin-left: 16px');
      });

      it("should convert 'borderWidth--s:sm:1__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('borderWidth--s:sm:1__16', breakpoints);

        expect(result).toContain('.borderWidth__16 {');
        expect(result).toContain('border-width: 16px');
      });

      it("should convert 'boxWidth--s:sm:1__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('boxWidth--s:sm:1__16', breakpoints);

        expect(result).toContain('.width__16 {');
        expect(result).toContain('width: 16px');
      });

      it("should convert 'boxHeight--s:sm:1__16' into a valid CSS rule", () => {
        const result = transformDimensionKeyToCss('boxHeight--s:sm:1__16', breakpoints);

        expect(result).toContain('.height__16 {');
        expect(result).toContain('height: 16px');
      });
    });

    describe('Valid Properties (Media Query Support)', () => {
      it("should convert 'paddingTop--s:sm:1::bp:lg:1__16' into a valid CSS rule with media query", () => {
        const result = transformDimensionKeyToCss('paddingTop--s:sm:1::bp:lg:1__16', breakpoints);
        expect(result.className).toEqual('paddingTop--lg1__16');

        // Retrieve the breakpoint value for the media token.
        // The token should match exactly what is provided (e.g. "bp:lg:1")
        const bpValue = breakpoints['bp:lg:1'];
        expect(bpValue).toBeDefined();
        expect(result.cssRule).toContain(`@media (min-width: ${bpValue}px)`);

        // Based on the conversion logic, the custom size token is dropped so that the
        // resulting class name contains only the base property and a simplified breakpoint modifier.
        // For "paddingTop", the converted class name should be: ".paddingTop--lg1__16".
        expect(result.cssRule).toContain('.paddingTop--lg1__16');

        // Checks that the CSS rule contains the correct property and value.
        expect(result.cssRule).toContain('padding-top: 16px');

        expect(result).toMatchSnapshot();
      });

      it("should convert 'textSize--s:sm:1::bp:lg:1__16' into a valid CSS rule with media query and rem unit", () => {
        const result = transformDimensionKeyToCss('textSize--s:sm:1::bp:lg:1__16', breakpoints);

        const bpValue = breakpoints['bp:lg:1'];
        expect(bpValue).toBeDefined();
        expect(result).toContain(`@media (min-width: ${bpValue}px)`);
        expect(result).toContain('.textSize--lg1__16');
        expect(result).toContain('font-size: 1rem');
      });
    });
  });

  describe('Error handling', () => {
    it('Exception 1 - should throw error when no matching dimension key is found', () => {
      expect(() =>
        transformDimensionKeyToCss('invalidKey--s:sm:1::bp:lg:1__16', breakpoints)
      ).toThrowError(ERROR_NO_MATCHING_DIMENSION_KEY);
    });

    it('Exception 2 - should throw error when the media query pattern has too many parts', () => {
      expect(() =>
        transformDimensionKeyToCss('textSize--s:sm:1::bp:lg:1__16__extra', breakpoints)
      ).toThrowError(ERROR_INVALID_MEDIA_QUERY_PATTERN);
    });

    it('Exception 3 - should throw error when the media query token format is invalid', () => {
      expect(() =>
        transformDimensionKeyToCss('textSize--s:sm:1::lg:1__16', breakpoints)
      ).toThrowError(ERROR_INVALID_MEDIA_TOKEN);
    });

    it('Exception 4 - should throw error when the custom token is not a valid size prop', () => {
      expect(() =>
        transformDimensionKeyToCss('paddingTop--foo::bp:lg:1__16', breakpoints)
      ).toThrowError(ERROR_INVALID_CUSTOM_TOKEN);
    });

    describe('Exception 5 - Invalid Format Cases for Custom Token and Missing Value', () => {
      it("should throw error when a non-valid custom token is provided for 'textSize'", () => {
        expect(() => transformDimensionKeyToCss('textSize--invalid__16', breakpoints)).toThrowError(
          ERROR_INVALID_CUSTOM_TOKEN
        );
      });

      it("should throw error when the custom token is missing (empty) for 'textSize'", () => {
        expect(() => transformDimensionKeyToCss('textSize--__16', breakpoints)).toThrowError(
          ERROR_INVALID_CUSTOM_TOKEN
        );
      });

      it("should throw error when the value part is missing for 'textSize'", () => {
        expect(() => transformDimensionKeyToCss('textSize--s:sm:1', breakpoints)).toThrowError(
          ERROR_MISSING_VALUE
        );
      });
    });

    describe('Exception 6 - Unrecognized Dimension Key', () => {
      it("should throw error when provided with an invalid dimension key (e.g. 'paddingCenter__16')", () => {
        expect(() => transformDimensionKeyToCss('paddingCenter__16', breakpoints)).toThrowError(
          ERROR_NO_STANDARD_DIMENSION_KEY
        );
      });
    });

    describe('Exception 7 - Dimension Key with Extra Separators', () => {
      it("should throw error when the dimension key has extra '__' delimiters (e.g. 'paddingTop__16__16')", () => {
        expect(() => transformDimensionKeyToCss('paddingTop__16__16', breakpoints)).toThrowError(
          ERROR_INVALID_STANDARD_PATTERN
        );
      });
    });

    describe('Exception 8 - Invalid Dimension Identifier Format', () => {
      it('should throw error when the dimension key does not include any expected delimiters', () => {
        expect(() => transformDimensionKeyToCss('invalidKey', breakpoints)).toThrowError(
          ERROR_INVALID_KEY_FORMAT
        );
      });

      it('should throw error when the dimension key is only partially formatted', () => {
        expect(() => transformDimensionKeyToCss('textSize-16', breakpoints)).toThrowError(
          ERROR_INVALID_KEY_FORMAT
        );
      });

      it('should throw error when provided with an empty string as the dimension key', () => {
        expect(() => transformDimensionKeyToCss('', breakpoints)).toThrowError(
          ERROR_INVALID_KEY_FORMAT
        );
      });
    });
  });
});
