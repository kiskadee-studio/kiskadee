import { describe, it, expect } from 'vitest';
import { transformShadowKeyToCss } from '../transformShadowKeyToCss';
import { InteractionStateCssMapping } from '@kiskadee/schema';

describe('transformShadowKeyToCss', () => {
  describe('Valid shadow keys', () => {
    it('should transform default state shadow key using hex color conversion', () => {
      // For HSLA [0,0,0,1] convertHslaToHex returns "#000000"
      const styleKey = 'shadow__[2,4,5,"[0,0,0,1]"]';
      const expected = '.shadow__[2,4,5,"[0,0,0,1]"] { box-shadow: 2px 4px 5px #000000; }';
      expect(transformShadowKeyToCss(styleKey)).toBe(expected);
    });

    it('should transform a hover state shadow key with pseudo-selector', () => {
      // For HSLA [0,0,0,0.5] convertHslaToHex returns "#00000080"
      const styleKey = 'shadow--hover__[6,8,10,"[0,0,0,0.5]"]';
      const expected = `.shadow--hover__[6,8,10,"[0,0,0,0.5]"]${InteractionStateCssMapping.hover} { box-shadow: 6px 8px 10px #00000080; }`;
      expect(transformShadowKeyToCss(styleKey)).toBe(expected);
    });

    it('should transform a pressed state shadow key to use :active pseudo-selector', () => {
      const styleKey = 'shadow--pressed__[3,3,3,"[0,0,0,1]"]';
      const expected = `.shadow--pressed__[3,3,3,"[0,0,0,1]"]${InteractionStateCssMapping.pressed} { box-shadow: 3px 3px 3px #000000; }`;
      expect(transformShadowKeyToCss(styleKey)).toBe(expected);
    });

    it('should treat "pseudo-disabled" as rest (no pseudo-selector)', () => {
      const styleKey = 'shadow--pseudo-disabled__[5,5,5,"[0,0,0,1]"]';
      // "pseudo-disabled" should map to an empty pseudo (like rest)
      const expected =
        '.shadow--pseudo-disabled__[5,5,5,"[0,0,0,1]"] { box-shadow: 5px 5px 5px #000000; }';
      expect(transformShadowKeyToCss(styleKey)).toBe(expected);
    });

    it('should use the raw color value when JSON parsing fails', () => {
      // The color "blue" cannot be parsed as JSON into an array, so it remains as-is.
      const styleKey = 'shadow__[10,20,30,blue]';
      const expected = '.shadow__[10,20,30,blue] { box-shadow: 10px 20px 30px blue; }';
      expect(transformShadowKeyToCss(styleKey)).toBe(expected);
    });
  });

  describe('Error handling', () => {
    it('should throw an error when key does not start with "shadow"', () => {
      const invalidKey = 'notShadow__[2,4,5,"[0,0,0,1]"]';
      expect(() => transformShadowKeyToCss(invalidKey)).toThrowError(
        /Invalid style key "notShadow__.*"/
      );
    });

    it('should throw an error for an invalid shadow key format', () => {
      // Missing proper bracket structure
      const invalidKey = 'shadow__2,4,5,"[0,0,0,1]"';
      expect(() => transformShadowKeyToCss(invalidKey)).toThrowError(
        `Invalid shadow style key format: ${invalidKey}`
      );
    });

    it('should throw an error when the shadow values cannot be parsed', () => {
      // Content does not match expected "x,y,blur,color" pattern.
      const invalidKey = 'shadow__[2,4,"invalid"]';
      expect(() => transformShadowKeyToCss(invalidKey)).toThrowError(
        `Invalid shadow values in key: ${invalidKey}`
      );
    });

    it('should throw an error for an unsupported interaction state', () => {
      const invalidKey = 'shadow--unknown__[1,1,1,"[0,0,0,1]"]';
      expect(() => transformShadowKeyToCss(invalidKey)).toThrowError(
        `Unsupported interaction state "unknown" in shadow key "${invalidKey}".`
      );
    });
  });
});
