import { describe, it, expect } from 'vitest';
import { transformColorKeyToCss } from './transformColorKeyToCss';

describe('transformColorKeyToCss', () => {
  it('should correctly transform a key without "::ref" (alpha = 1)', () => {
    // Example: textColor, HSLA [120,50,50,1]
    // Using HSLA conversion, the computed hex should be:
    // For [120, 50, 50, 1]:
    //   s = 50 / 100 = 0.5, l = 50 / 100 = 0.5, c = 0.5, m = 0.25,
    //   Since h=120 is in [120,180], we get r=0, g=0.5, b=0.
    //   Channel conversions:
    //     r: (0 + 0.25)*255 = ~64 -> "40"
    //     g: (0.5+0.25)*255 = ~191 -> "bf"
    //     b: (0+0.25)*255 = ~64 -> "40"
    //   Alpha is 1 so no alpha hex appended.
    const inputKey = 'textColor__[120,50,50,1]';
    const expectedCssRule = '.textColor__[120,50,50,1] { color: #40bf40; }';
    expect(transformColorKeyToCss(inputKey)).toBe(expectedCssRule);
  });

  it('should correctly transform a key with "::ref" (alpha < 1)', () => {
    // Example: bgColor with referential selector -- key containing "::ref" and HSLA [240,50,50,0.5]
    // For [240,50,50,0.5]:
    //   h=240, s=0.5, l=0.5, so c = 0.5, m = 0.25.
    //   For h in [240,300), we get: r = x = 0, g = 0, b = c = 0.5.
    //   Channel conversions:
    //     r: (0 + 0.25)*255 ≈ 64 -> "40"
    //     g: (0 + 0.25)*255 ≈ 64 -> "40"
    //     b: (0.5+0.25)*255 ≈ 191 -> "bf"
    //   Alpha: 0.5 * 255 = ~128 -> "80"
    //   Expected hex: "#4040bf80"
    // The CSS rule should have two selectors: one for the full key and one for the referential part.
    const inputKey = 'bgColor--hover::ref__[240,50,50,0.5]';
    const expectedCssRule =
      '.bgColor--hover::ref__[240,50,50,0.5] .bgColor--hover::ref { background-color: #4040bf80; }';
    expect(transformColorKeyToCss(inputKey)).toBe(expectedCssRule);
  });

  it('should throw an error when the key format is invalid', () => {
    const invalidKey = 'textColor'; // missing HSLA value in brackets
    expect(() => transformColorKeyToCss(invalidKey)).toThrowError(
      'Invalid key format. Expected value in square brackets at the end.'
    );
  });
});
