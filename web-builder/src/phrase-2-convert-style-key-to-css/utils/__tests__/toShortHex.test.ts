import { describe, expect, it } from 'vitest';
import { toShortHex } from '../toShortHex';
import type { Hex } from '@kiskadee/schema';

describe('toShortHex', () => {
  describe('Successful operation', () => {
    it('should return the original 3-digit shorthand as is', () => {
      const shortHex: Hex = '#abc';
      expect(toShortHex(shortHex)).toBe('#abc');
    });

    it('should convert a 6-digit hex that is fully repeatable into shorthand form', () => {
      const fullHex: Hex = '#000000';
      expect(toShortHex(fullHex)).toBe('#000');
    });

    it('should convert another 6-digit hex into shorthand form', () => {
      const fullHex: Hex = '#112233';
      // Pairs "11", "22", "33" shorten to "#123"
      expect(toShortHex(fullHex)).toBe('#123');
    });

    it('should convert an 8-digit hex that is fully repeatable into shorthand form', () => {
      const fullHex: Hex = '#aabbccdd';
      // Pairs "aa", "bb", "cc", "dd" shorten to "#abcd"
      expect(toShortHex(fullHex)).toBe('#abcd');
    });

    it('should return the original 6-digit hex if it cannot be shortened', () => {
      const nonShortenable: Hex = '#123456';
      // Because "12", "34", "56" are not pairs of identical digits.
      expect(toShortHex(nonShortenable)).toBe(nonShortenable);
    });

    it('should return the original 8-digit hex if it cannot be shortened', () => {
      const nonShortenable: Hex = '#ff000080';
      // The alpha pair "80" is not composed of identical digits.
      expect(toShortHex(nonShortenable)).toBe(nonShortenable);
    });
  });

  describe('Error handling', () => {
    it('should throw an error for strings that do not start with "#"', () => {
      const invalidHex: Hex = '123456';
      expect(() => toShortHex(invalidHex)).toThrowError(/Invalid hex format: 123456/);
    });

    it('should throw an error for strings with invalid length', () => {
      const invalidLength: Hex = '#12345';
      expect(() => toShortHex(invalidLength)).toThrowError(/Invalid hex format: #12345/);
    });
  });
});
