import { describe, it, expect } from 'vitest';
import {
  transformColorKeyToCss,
  ERROR_INVALID_KEY_FORMAT,
  ERROR_REF_REQUIRE_STATE
} from './transformColorKeyToCss';
import type { GeneratedCss } from '../phrase2.types';

describe('transformColorKeyToCss', () => {
  describe('Success operation', () => {
    it('should transform a key without "::ref"', () => {
      const styleKey = 'textColor__[120,50,50,1]';
      const rule = '.textColor__[120,50,50,1] { color: #40bf40; }';
      const expected: GeneratedCss = {
        className: styleKey,
        cssRule: rule
      };
      expect(transformColorKeyToCss(styleKey)).toEqual(expected);
    });

    it('should transform a key with "--hover::ref" and include :hover on parent', () => {
      const result = transformColorKeyToCss('boxColor--hover::ref__[240,50,50,0.5]');
      const expected: GeneratedCss = {
        className: 'boxColor--hover::ref',
        parentClassName: 'boxColor--hover::ref__[240,50,50,0.5]',
        cssRule:
          '.boxColor--hover::ref__[240,50,50,0.5]:hover .boxColor--hover::ref { background-color: #4040bf80; }'
      };
      expect(result).toEqual(expected);
      expect(result).toMatchSnapshot();
    });

    it('should transform a key without "::ref" and include ":hover"', () => {
      const result = transformColorKeyToCss('boxColor--hover__[240,50,50,0.5]');
      const expected: GeneratedCss = {
        className: 'boxColor--hover__[240,50,50,0.5]',
        cssRule: '.boxColor--hover__[240,50,50,0.5]:hover { background-color: #4040bf80; }',
        parentClassName: undefined
      };
      expect(result).toEqual(expected);
      expect(result).toMatchSnapshot();
    });

    it('should transform a key with "--focus::ref" and include :focus on parent', () => {
      const key = 'textColor--focus::ref__[0,0,0,0.3]';
      const child = 'textColor--focus::ref';
      const rule =
        '.textColor--focus::ref__[0,0,0,0.3]:focus .textColor--focus::ref { color: #0000004d; }';
      const expected: GeneratedCss = {
        className: child,
        parentClassName: key,
        cssRule: rule
      };
      expect(transformColorKeyToCss(key)).toEqual(expected);
    });
  });

  describe('Error handling', () => {
    it('should throw if "::ref" is used without a state', () => {
      const key = 'boxColor::ref__[240,50,50,0.5]';
      const fn = () => transformColorKeyToCss(key);
      expect(fn).toThrowError(ERROR_REF_REQUIRE_STATE);
      expect(fn).toThrowErrorMatchingSnapshot();
    });

    it('should throw if the style key format is invalid', () => {
      const fn = () => transformColorKeyToCss('invalidKey');
      expect(fn).toThrowError(ERROR_INVALID_KEY_FORMAT);
      expect(fn).toThrowErrorMatchingSnapshot();
    });

    it('should throw when using unsupported state "visited"', () => {
      const key = 'boxColor--visited::ref__[240,50,50,0.5]';
      const fn = () => transformColorKeyToCss(key);
      expect(fn).toThrowError(ERROR_REF_REQUIRE_STATE);
      expect(fn).toThrowErrorMatchingSnapshot();
    });
  });
});
