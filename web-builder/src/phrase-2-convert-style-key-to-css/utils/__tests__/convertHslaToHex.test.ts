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

    it('should correctly handle hues near the upper boundary with alpha', () => {
      // For h=359, s=100, l=50, alpha=0.3 -> "#ff00044d"
      const hsla: HLSA = [359, 100, 50, 0.3];
      expect(convertHslaToHex(hsla)).toBe('#ff00044d');
    });

    it('should convert black color to hex properly and shorten it when possible', () => {
      // Black: any h, s=0, l=0, alpha=1 -> "#000000" shortened to "#000"
      const hsla: HLSA = [0, 0, 0, 1];
      expect(convertHslaToHex(hsla)).toBe('#000');
    });
  });

  describe('Error handling', () => {
    it('should throw an error when hsla is null', () => {
      const errorMessage = 'Invalid hsla value: expected an array, received object';
      expect(() => convertHslaToHex(null as unknown as HLSA)).toThrowError(errorMessage);
    });

    it('should throw an error when hsla is not an array', () => {
      const errorMessage = 'Invalid hsla value: expected an array, received object';
      expect(() => convertHslaToHex({} as unknown as HLSA)).toThrowError(errorMessage);
    });

    it('should throw an error when hsla array has less than 3 items', () => {
      const invalidHsla = [0, 100] as unknown as HLSA;
      const errorMessage = 'Invalid hsla array length: expected 3 or 4, received 2';
      expect(() => convertHslaToHex(invalidHsla)).toThrowError(errorMessage);
    });

    it('should throw an error when hsla array has more than 4 items', () => {
      const invalidHsla = [0, 100, 50, 1, 0] as unknown as HLSA;
      const errorMessage = 'Invalid hsla array length: expected 3 or 4, received 5';
      expect(() => convertHslaToHex(invalidHsla)).toThrowError(errorMessage);
    });

    it('should throw an error when hsla array contains non-numeric values', () => {
      const invalidHsla = ['0', '100', '50', '1'] as unknown as HLSA;
      const errorMessage = 'Invalid hsla value at index 0: expected a number, received 0';
      expect(() => convertHslaToHex(invalidHsla)).toThrowError(errorMessage);
    });

    it('should throw an error when alpha is undefined', () => {
      // Now that no hsla value can be undefined or null, this should throw.
      const invalidHsla = [30, 100, 50, undefined] as unknown as HLSA;
      const errorMessage = 'Invalid hsla value at index 3: expected a number, received undefined';
      expect(() => convertHslaToHex(invalidHsla)).toThrowError(errorMessage);
    });
  });
});
