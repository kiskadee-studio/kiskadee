import { describe, it, expect } from 'vitest';
import type { HLSA } from '@kiskadee/schema';
import { InteractionStateCssMapping } from '@kiskadee/schema';
import { convertHslaToHex } from '../../utils/convertHslaToHex';
import { transformShadowKeyToCss } from '../transformShadowKeyToCss';
import {
  UNSUPPORTED_PROPERTY,
  UNSUPPORTED_INTERACTION_STATE,
  INVALID_SHADOW_COLOR_VALUE,
  UNSUPPORTED_VALUE
} from '../../errorMessages';

const propertyName = 'shadow';

describe('transformShadowKeyToCss function', () => {
  describe('Successful operation', () => {
    it('should transform default state shadow key using hex color conversion', () => {
      const styleKey = `${propertyName}__[2,4,5,[0,0,0,1]]`;
      const hsla = JSON.parse('[0,0,0,1]') as HLSA;
      const hex = convertHslaToHex(hsla);
      const expectedCssRule = `.${styleKey} { box-shadow: 2px 4px 5px ${hex}; }`;

      const result = transformShadowKeyToCss(styleKey);
      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
      expect(result).toMatchSnapshot();
    });

    it('should transform a hover state shadow key with pseudo-selector', () => {
      const styleKey = `${propertyName}--hover__[6,8,10,[0,0,0,0.5]]`;
      const hsla = JSON.parse('[0,0,0,0.5]') as HLSA;
      const hex = convertHslaToHex(hsla);
      const pseudo = InteractionStateCssMapping.hover;
      const expectedCssRule = `.${styleKey}${pseudo} { box-shadow: 6px 8px 10px ${hex}; }`;

      const result = transformShadowKeyToCss(styleKey);
      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
      expect(result).toMatchSnapshot();
    });

    it('should transform a pressed state shadow key to use :active pseudo-selector', () => {
      const styleKey = `${propertyName}--pressed__[3,3,3,[0,0,0,1]]`;
      const hsla = JSON.parse('[0,0,0,1]') as HLSA;
      const hex = convertHslaToHex(hsla);
      const pseudo = InteractionStateCssMapping.pressed;
      const expectedCssRule = `.${styleKey}${pseudo} { box-shadow: 3px 3px 3px ${hex}; }`;

      const result = transformShadowKeyToCss(styleKey);
      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
      expect(result).toMatchSnapshot();
    });

    it('should treat "pseudo-disabled" as rest (no pseudo-selector)', () => {
      const styleKey = `${propertyName}--pseudoDisabled__[5,5,5,[0,0,0,1]]`;
      const hsla = JSON.parse('[0,0,0,1]') as HLSA;
      const hex = convertHslaToHex(hsla);
      const expectedCssRule = `.${styleKey} { box-shadow: 5px 5px 5px ${hex}; }`;

      const result = transformShadowKeyToCss(styleKey);
      expect(result).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('Error handling', () => {
    it('should throw an error when key does not start with "shadow" or format is invalid', () => {
      const invalidKey1 = 'notShadow__[2,4,5,[0,0,0,1]]';
      const fn1 = () => transformShadowKeyToCss(invalidKey1);
      expect(fn1).toThrowError(UNSUPPORTED_PROPERTY(propertyName, invalidKey1));
      expect(fn1).toThrowErrorMatchingSnapshot();

      const invalidKey2 = `${propertyName}__2,4,5,[0,0,0,1]`;
      const fn2 = () => transformShadowKeyToCss(invalidKey2);
      expect(fn2).toThrowError(UNSUPPORTED_PROPERTY(propertyName, invalidKey2));
      expect(fn2).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error when the shadow values cannot be parsed', () => {
      const invalidKey = 'shadow__[2,4,"invalid"]';
      const fn = () => transformShadowKeyToCss(invalidKey);
      expect(fn).toThrowError(UNSUPPORTED_VALUE(propertyName, '2,4,"invalid"', invalidKey));
      expect(fn).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error for an unsupported interaction state', () => {
      const invalidKey = 'shadow--unknown__[1,1,1,[0,0,0,1]]';
      const fn = () => transformShadowKeyToCss(invalidKey);
      expect(fn).toThrowError(UNSUPPORTED_INTERACTION_STATE('unknown', invalidKey));
      expect(fn).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error for an invalid color value', () => {
      const styleKey = `${propertyName}__[10,20,30,blue]`;
      const fn = () => transformShadowKeyToCss(styleKey);
      expect(fn).toThrowError(INVALID_SHADOW_COLOR_VALUE);
      expect(fn).toThrowErrorMatchingSnapshot();
    });
  });
});
