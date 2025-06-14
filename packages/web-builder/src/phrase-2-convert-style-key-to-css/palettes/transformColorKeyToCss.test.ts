import { describe, it, expect } from 'vitest';
import { transformColorKeyToCss } from './transformColorKeyToCss';
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
      const result = transformColorKeyToCss('bgColor--hover::ref__[240,50,50,0.5]');

      const expected: GeneratedCss = {
        className: 'bgColor--hover::ref',
        parentClassName: 'bgColor--hover::ref__[240,50,50,0.5]',
        cssRule:
          '.bgColor--hover::ref__[240,50,50,0.5]:hover .bgColor--hover::ref { background-color: #4040bf80; }'
      };

      expect(result).toEqual(expected);
      expect(result).toMatchSnapshot();
    });

    it('should transform a key without "::ref" and include ":hover"', () => {
      const result = transformColorKeyToCss('bgColor--hover__[240,50,50,0.5]');

      const expected: GeneratedCss = {
        className: 'bgColor--hover__[240,50,50,0.5]',
        cssRule: '.bgColor--hover__[240,50,50,0.5]:hover { background-color: #4040bf80; }',
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
      const key = 'bgColor::ref__[240,50,50,0.5]';
      expect(() => transformColorKeyToCss(key)).toThrowError(
        'Invalid key format. "::ref" requires a preceding interaction state.'
      );
    });

    it('should throw if the key format is invalid', () => {
      expect(() => transformColorKeyToCss('invalidKey')).toThrowError(
        'Invalid key format. Expected value in square brackets at the end.'
      );
    });

    it('should throw when using unsupported state "visited"', () => {
      const key = 'bgColor--visited::ref__[240,50,50,0.5]';
      expect(() => transformColorKeyToCss(key)).toThrowError(
        'Invalid key format. "::ref" requires a preceding interaction state.'
      );
    });
  });
});
