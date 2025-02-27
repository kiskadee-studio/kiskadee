// convertDimensions.test.ts
import { describe, expect, it } from 'vitest';
import { convertDimensions } from './convertDimensions';

// Breakpoints definition.
const breakpoints = {
  all: 0,
  sm1: 320,
  sm2: 360,
  sm3: 400,
  md1: 568,
  md2: 768,
  md3: 1024,
  lg1: 1152,
  lg2: 1312,
  lg3: 1792,
  lg4: 2432
};

// The expected mapping from dimension keys to CSS property names.
const expectedProperties: Record<string, string> = {
  textSize: 'font-size',
  paddingTop: 'padding-top',
  marginLeft: 'margin-left',
  borderWidth: 'border-width',
  width: 'width',
  height: 'height'
};

describe('convertDimensions', () => {
  describe('convertDimensions - Valid Properties (Simple Conversion)', () => {
    it("should convert 'textSize--sm__16' into a valid CSS rule", () => {
      const key = 'textSize--sm__16';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.textSize-sm {');
      // For textSize, 16px converts to 1rem.
      expect(result).toContain(`${expectedProperties.textSize}: 1rem`);
    });

    it("should convert 'paddingTop--sm__16' into a valid CSS rule", () => {
      const key = 'paddingTop--sm__16';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.paddingTop-sm {');
      expect(result).toContain(`${expectedProperties.paddingTop}: 16px`);
    });

    it("should convert 'marginLeft--sm__16' into a valid CSS rule", () => {
      const key = 'marginLeft--sm__16';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.marginLeft-sm {');
      expect(result).toContain(`${expectedProperties.marginLeft}: 16px`);
    });

    it("should convert 'borderWidth--sm__16' into a valid CSS rule", () => {
      const key = 'borderWidth--sm__16';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.borderWidth-sm {');
      expect(result).toContain(`${expectedProperties.borderWidth}: 16px`);
    });

    it("should convert 'width--sm__16' into a valid CSS rule", () => {
      const key = 'width--sm__16';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.width-sm {');
      expect(result).toContain(`${expectedProperties.width}: 16px`);
    });

    it("should convert 'height--sm__16' into a valid CSS rule", () => {
      const key = 'height--sm__16';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.height-sm {');
      expect(result).toContain(`${expectedProperties.height}: 16px`);
    });
  });

  describe('convertDimensions - Valid Properties (Media Query Conversion)', () => {
    it("should convert 'textSize--md::lg1__32' into a media query wrapped CSS rule", () => {
      const key = 'textSize--md::lg1__32';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.textSize-md {');
      // For textSize, 32px converts to 2rem.
      expect(result).toContain(`${expectedProperties.textSize}: 2rem`);
      expect(result).toContain(`@media (min-width: ${breakpoints.lg1}px)`);
    });

    it("should convert 'paddingTop--md::lg1__32' into a media query wrapped CSS rule", () => {
      const key = 'paddingTop--md::lg1__32';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.paddingTop-md {');
      expect(result).toContain(`${expectedProperties.paddingTop}: 32px`);
      expect(result).toContain(`@media (min-width: ${breakpoints.lg1}px)`);
    });

    it("should convert 'marginLeft--md::lg1__32' into a media query wrapped CSS rule", () => {
      const key = 'marginLeft--md::lg1__32';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.marginLeft-md {');
      expect(result).toContain(`${expectedProperties.marginLeft}: 32px`);
      expect(result).toContain(`@media (min-width: ${breakpoints.lg1}px)`);
    });

    it("should convert 'borderWidth--md::lg1__32' into a media query wrapped CSS rule", () => {
      const key = 'borderWidth--md::lg1__32';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.borderWidth-md {');
      expect(result).toContain(`${expectedProperties.borderWidth}: 32px`);
      expect(result).toContain(`@media (min-width: ${breakpoints.lg1}px)`);
    });

    it("should convert 'width--md::lg1__32' into a media query wrapped CSS rule", () => {
      const key = 'width--md::lg1__32';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.width-md {');
      expect(result).toContain(`${expectedProperties.width}: 32px`);
      expect(result).toContain(`@media (min-width: ${breakpoints.lg1}px)`);
    });

    it("should convert 'height--md::lg1__32' into a media query wrapped CSS rule", () => {
      const key = 'height--md::lg1__32';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeTruthy();
      expect(result).toContain('.height-md {');
      expect(result).toContain(`${expectedProperties.height}: 32px`);
      expect(result).toContain(`@media (min-width: ${breakpoints.lg1}px)`);
    });
  });

  describe('convertDimensions - Exceptions', () => {
    it('should return null for a key with an invalid prefix', () => {
      const key = 'invalid--sm__10';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeNull();
    });

    it('should return null for a key missing the proper delimiter', () => {
      const key = 'width--sm-100';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeNull();
    });

    it('should return null if the dimension value is not numeric', () => {
      const key = 'borderWidth--md__abc';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeNull();
    });

    it('should return null if the media query breakpoint key is not found in breakpoints', () => {
      const key = 'height--lg::invalid__100';
      const result = convertDimensions(key, breakpoints);
      expect(result).toBeNull();
    });
  });
});
