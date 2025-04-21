import { describe, expect, it } from 'vitest';
import { convertHslaToHex } from '../convertHslaToHex';
import type { HLSA } from '@kiskadee/schema';

describe('convertHslaToHex', () => {
  describe('Successful operation', () => {
    it('should convert pure red with full opacity to 3-digit hex', () => {
      // Pure red: h=0, s=100, l=50, alpha=1 -> "#ff0000" shortened to "#f00"
      const hsla: HLSA = [0, 100, 50, 1];
      expect(convertHslaToHex(hsla)).toBe('#f00');
    });

    it('should convert pure green with full opacity to 3-digit hex', () => {
      // Pure green: h=120, s=100, l=50, alpha=1 -> "#00ff00" shortened to "#0f0"
      const hsla: HLSA = [120, 100, 50, 1];
      expect(convertHslaToHex(hsla)).toBe('#0f0');
    });

    it('should convert pure blue with full opacity to 3-digit hex', () => {
      // Pure blue: h=240, s=100, l=50, alpha=1 -> "#0000ff" shortened to "#00f"
      const hsla: HLSA = [240, 100, 50, 1];
      expect(convertHslaToHex(hsla)).toBe('#00f');
    });

    it('should convert an orange color to valid hex with full opacity', () => {
      // Orange: h=30, s=100, l=50, alpha=1 -> "#ff8000" (cannot be shortened)
      const hsla: HLSA = [30, 100, 50, 1];
      expect(convertHslaToHex(hsla)).toBe('#ff8000');
    });

    it('should include alpha in hex when alpha is not 1, returning an 8-digit hex', () => {
      // Pure red with half-transparency: h=0, s=100, l=50, alpha=0.5 -> "#ff000080"
      const hsla: HLSA = [0, 100, 50, 0.5];
      expect(convertHslaToHex(hsla)).toBe('#ff000080');
    });

    it('should return a 6-digit hex (or shortened) if alpha is null or undefined', () => {
      // Using undefined for alpha should be treated as full opacity.
      // For orange, the hex result "#ff8000" cannot be shortened.
      const hsla: HLSA = [30, 100, 50, undefined as unknown as number];
      expect(convertHslaToHex(hsla)).toBe('#ff8000');
    });

    it('should correctly handle hues near the upper boundary with alpha', () => {
      // For h=359, s=100, l=50, alpha=0.3
      // Expected: "#ff00044d" (non-shortenable due to the alpha part)
      const hsla: HLSA = [359, 100, 50, 0.3];
      expect(convertHslaToHex(hsla)).toBe('#ff00044d');
    });

    it('should convert black color to hex properly and shorten it when possible', () => {
      // Black: h=any, s=0, l=0, alpha=1 -> "#000000" shortened to "#000"
      const hsla: HLSA = [0, 0, 0, 1];
      expect(convertHslaToHex(hsla)).toBe('#000');
    });
  });

  describe('Error handling', () => {
    it('should throw an error when hsla is null', () => {
      // hsla is required for conversion, passing null should result in error
      expect(() => convertHslaToHex(null as unknown as HLSA)).toThrow();
    });

    it('should throw an error when hsla is not an array', () => {
      // Passing a value that is not an array should result in an error
      expect(() => convertHslaToHex({} as unknown as HLSA)).toThrow();
    });
  });
});
