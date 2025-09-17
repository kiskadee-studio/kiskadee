import { describe, expect, it } from 'vitest';
import {
  ERROR_INVALID_KEY_FORMAT,
  ERROR_REF_REQUIRE_STATE,
  transformColorKeyToCss
} from './transformColorKeyToCss';

const className = 'abc';

describe('transformColorKeyToCss', () => {
  describe('Success operation', () => {
    it('should transform a key without reference', () => {
      const styleKey = 'textColor__[120,50,50,1]';
      const result = transformColorKeyToCss(styleKey, className);

      expect(result).toEqual('.abc { color: #40bf40 }');
    });

    it('should add forced class selector gated by activator alongside pseudo-class when forceState is true (inline)', () => {
      const result = transformColorKeyToCss('boxColor--hover__[240,50,50,0.5]', className, true);

      // expects both :hover and forced class (.-h) gated by activator (.-a) applied to the same element (i.e. .abc.-h.-a)
      expect(result).toEqual('.abc:hover, .abc.-h.-a { background-color: #4040bf80 }');
    });

    it('should transform a key with "==hover" and include :hover on parent', () => {
      const result = transformColorKeyToCss('boxColor==hover__[240,50,50,0.5]', className);

      expect(result).toEqual('.-a:hover .abc { background-color: #4040bf80 }');
    });

    it('should add forced child class selector alongside parent pseudo-class when forceState is true (ref)', () => {
      const result = transformColorKeyToCss('boxColor==hover__[240,50,50,0.5]', className, true);

      // expects both parent :hover and forced parent class (.-h) to be combined as selectors
      expect(result).toEqual('.-a:hover .abc, .-a.-h .abc { background-color: #4040bf80 }');
    });

    it('should transform a key without reference and include ":hover"', () => {
      const result = transformColorKeyToCss('boxColor--hover__[240,50,50,0.5]', className);

      expect(result).toEqual('.abc:hover { background-color: #4040bf80 }');
    });

    it('should transform a key with "==focus" and include :focus on parent', () => {
      const result = transformColorKeyToCss('textColor==focus__[0,0,0,0.3]', className);

      expect(result).toEqual('.-a:focus .abc { color: #0000004d }');
    });

    it('should include forced disabled selector gated by activator (inline)', () => {
      const result = transformColorKeyToCss('boxColor--disabled__[240,50,50,0.5]', className, true);
      expect(result).toEqual(
        '.abc:disabled, .abc.-d.-a { background-color: #4040bf80 }'
      );
    });

    it('should include forced disabled selector gated by activator (ref)', () => {
      const result = transformColorKeyToCss('textColor==disabled__[0,0,0,0.3]', className, true);
      expect(result).toEqual(
        '.-a:disabled .abc, .-a.-d .abc { color: #0000004d }'
      );
    });
  });

  describe('Error handling', () => {
    it('should throw if "==" is used without a state', () => {
      const key = 'boxColor==__[240,50,50,0.5]';
      const fn = (): string => transformColorKeyToCss(key, className);
      expect(fn).toThrowError(ERROR_REF_REQUIRE_STATE);
    });

    it('should throw if the style key format is invalid', () => {
      const fn = (): string => transformColorKeyToCss('invalidKey', className);
      expect(fn).toThrowError(ERROR_INVALID_KEY_FORMAT);
    });

    it('should throw when using unsupported state "visited"', () => {
      const key = 'boxColor==visited__[240,50,50,0.5]';
      const fn = (): string => transformColorKeyToCss(key, className);
      expect(fn).toThrowError(ERROR_REF_REQUIRE_STATE);
    });
  });
});
