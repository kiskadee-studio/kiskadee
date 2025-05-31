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

      // CSS rule: .shadow__[2,4,5,[0,0,0,1]] { box-shadow: 2px 4px 5px #000; }
      expect(transformShadowKeyToCss(styleKey)).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
    });

    it('should transform a hover state shadow key with pseudo-selector', () => {
      const styleKey = `${propertyName}--hover__[6,8,10,[0,0,0,0.5]]`;
      const hsla = JSON.parse('[0,0,0,0.5]') as HLSA;
      const hex = convertHslaToHex(hsla);
      const pseudo = InteractionStateCssMapping.hover;
      const expectedCssRule = `.${styleKey}${pseudo} { box-shadow: 6px 8px 10px ${hex}; }`;

      // CSS rule: .shadow--hover__[6,8,10,[0,0,0,0.5]]:hover { box-shadow: 6px 8px 10px #00000080; }
      expect(transformShadowKeyToCss(styleKey)).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
    });

    it('should transform a pressed state shadow key to use :active pseudo-selector', () => {
      const styleKey = `${propertyName}--pressed__[3,3,3,[0,0,0,1]]`;
      const hsla = JSON.parse('[0,0,0,1]') as HLSA;
      const hex = convertHslaToHex(hsla);
      const pseudo = InteractionStateCssMapping.pressed;
      const expectedCssRule = `.${styleKey}${pseudo} { box-shadow: 3px 3px 3px ${hex}; }`;

      // CSS rule: .shadow--pressed__[3,3,3,[0,0,0,1]]:active { box-shadow: 3px 3px 3px #000; }
      expect(transformShadowKeyToCss(styleKey)).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
    });

    it('should treat "pseudo-disabled" as rest (no pseudo-selector)', () => {
      const styleKey = `${propertyName}--pseudoDisabled__[5,5,5,[0,0,0,1]]`;
      const hsla = JSON.parse('[0,0,0,1]') as HLSA;
      const hex = convertHslaToHex(hsla);
      const expectedCssRule = `.${styleKey} { box-shadow: 5px 5px 5px ${hex}; }`;

      // CSS rule: .shadow--pseudoDisabled__[5,5,5,[0,0,0,1]] { box-shadow: 5px 5px 5px #000; }
      expect(transformShadowKeyToCss(styleKey)).toEqual({
        className: styleKey,
        cssRule: expectedCssRule
      });
    });
  });

  describe('Error handling', () => {
    it('should throw an error when key does not start with "shadow" or format is invalid', () => {
      const invalidKey1 = 'notShadow__[2,4,5,[0,0,0,1]]';
      // Expected error: `Invalid style key "notShadow__[2,4,5,[0,0,0,1]]". Expected the key to be in the format "<property>__<value>" with the property part being "shadow".`
      expect(() => transformShadowKeyToCss(invalidKey1)).toThrowError(
        UNSUPPORTED_PROPERTY(propertyName, invalidKey1)
      );

      const invalidKey2 = `${propertyName}__2,4,5,[0,0,0,1]`;
      // Expected error: `Invalid style key "shadow__2,4,5,[0,0,0,1]". Expected the key to be in the format "<property>__<value>" with the property part being "shadow".`
      expect(() => transformShadowKeyToCss(invalidKey2)).toThrowError(
        UNSUPPORTED_PROPERTY(propertyName, invalidKey2)
      );
    });

    it('should throw an error when the shadow values cannot be parsed', () => {
      const invalidKey = 'shadow__[2,4,"invalid"]';
      // Expected error: `Unsupported value "2,4,\"invalid\"" for property "shadow" in style key "shadow__[2,4,\"invalid\"]".`
      expect(() => transformShadowKeyToCss(invalidKey)).toThrowError(
        UNSUPPORTED_VALUE(propertyName, '2,4,"invalid"', invalidKey)
      );
    });

    it('should throw an error for an unsupported interaction state', () => {
      const invalidKey = 'shadow--unknown__[1,1,1,[0,0,0,1]]';
      // Expected error: `Unsupported interaction state "unknown" in shadow key "shadow--unknown__[1,1,1,[0,0,0,1]]".`
      expect(() => transformShadowKeyToCss(invalidKey)).toThrowError(
        UNSUPPORTED_INTERACTION_STATE('unknown', invalidKey)
      );
    });

    it('should throw an error for an invalid color value', () => {
      const styleKey = `${propertyName}__[10,20,30,blue]`;
      // Expected error: `Invalid shadow color value.`
      expect(() => transformShadowKeyToCss(styleKey)).toThrowError(INVALID_SHADOW_COLOR_VALUE);
    });
  });
});
