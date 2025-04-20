import { describe, it, expect } from 'vitest';
import { transformShadowKeyToCss } from '../transformShadowKeyToCss';

describe('transformShadowKeyToCss', () => {
  describe('Valid shadow keys', () => {
    it('should transform default state shadow key to CSS rule', () => {
      const styleKey = 'shadow__[2,4,5,"[0,0,0,1]"]';
      const expected = '.shadow__[2,4,5,"[0,0,0,1]"] { box-shadow: 2px 4px 5px rgba(0, 0, 0, 1); }';
      expect(transformShadowKeyToCss(styleKey)).toBe(expected);
    });

    it('should transform a hover state shadow key to CSS rule with pseudo-selector', () => {
      const styleKey = 'shadow--hover__[6,8,10,"[0,0,0,0.5]"]';
      const expected =
        '.shadow--hover__[6,8,10,"[0,0,0,0.5]"]:hover { box-shadow: 6px 8px 10px rgba(0, 0, 0, 0.5); }';
      expect(transformShadowKeyToCss(styleKey)).toBe(expected);
    });

    it('should use the raw color value when JSON parsing fails', () => {
      const styleKey = 'shadow__[10,20,30,blue]';
      // Since parsing "blue" will fail, the function should use the raw value.
      const expected = '.shadow__[10,20,30,blue] { box-shadow: 10px 20px 30px blue; }';
      expect(transformShadowKeyToCss(styleKey)).toBe(expected);
    });
  });

  describe('Error handling', () => {
    it('should throw an error when key does not start with "shadow"', () => {
      const invalidKey = 'notShadow__[2,4,5,"[0,0,0,1]"]';
      expect(() => transformShadowKeyToCss(invalidKey)).toThrowError(
        `Unsupported property for shadow: ${invalidKey}`
      );
    });

    it('should throw an error for an invalid shadow key format', () => {
      // Missing bracket structure
      const invalidKey = 'shadow__2,4,5,"[0,0,0,1]"';
      expect(() => transformShadowKeyToCss(invalidKey)).toThrowError(
        `Invalid shadow style key format: ${invalidKey}`
      );
    });

    it('should throw an error when the shadow values cannot be parsed', () => {
      // Content does not match expected "x,y,blur,color" pattern
      const invalidKey = 'shadow__[2,4,"invalid"]';
      expect(() => transformShadowKeyToCss(invalidKey)).toThrowError(
        `Invalid shadow values in key: ${invalidKey}`
      );
    });
  });
});
