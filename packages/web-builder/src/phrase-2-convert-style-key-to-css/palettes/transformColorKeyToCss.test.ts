import { describe, it, expect } from 'vitest';
import { transformColorKeyToCss } from './transformColorKeyToCss';

describe('transformColorKeyToCss', () => {
  describe('Success operation', () => {
    it('should transform a key without "::ref" (alpha = 1)', () => {
      const inputKey = 'textColor__[120,50,50,1]';
      const expected = '.textColor__[120,50,50,1] { color: #40bf40; }';
      expect(transformColorKeyToCss(inputKey)).toBe(expected);
    });

    it('should transform a key with "--hover::ref" and include :hover on parent', () => {
      const inputKey = 'bgColor--hover::ref__[240,50,50,0.5]';
      const expected =
        '.bgColor--hover::ref__[240,50,50,0.5]:hover .bgColor--hover::ref { background-color: #4040bf80; }';
      expect(transformColorKeyToCss(inputKey)).toBe(expected);
    });

    it('should transform a key with "--focus::ref" and include :focus on parent', () => {
      const inputKey = 'textColor--focus::ref__[0,0,0,0.3]';
      const expected =
        '.textColor--focus::ref__[0,0,0,0.3]:focus .textColor--focus::ref { color: #0000004d; }';
      expect(transformColorKeyToCss(inputKey)).toBe(expected);
    });
  });

  describe('Error handling', () => {
    it('should throw if "::ref" is used without a state', () => {
      const inputKey = 'bgColor::ref__[240,50,50,0.5]';
      expect(() => transformColorKeyToCss(inputKey)).toThrowError(
        'Invalid key format. "::ref" requires a preceding interaction state.'
      );
    });

    it('should throw if the key format is invalid', () => {
      expect(() => transformColorKeyToCss('invalidKey')).toThrowError(
        'Invalid key format. Expected value in square brackets at the end.'
      );
    });

    it('should throw when using unsupported state "visited"', () => {
      const inputKey = 'bgColor--visited::ref__[240,50,50,0.5]';
      expect(() => transformColorKeyToCss(inputKey)).toThrowError(
        'Invalid key format. "::ref" requires a preceding interaction state.'
      );
    });
  });
});
