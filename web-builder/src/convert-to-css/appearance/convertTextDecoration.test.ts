import { describe, expect, it } from 'vitest';
import { convertTextDecoration } from './convertTextDecoration';

describe('convertTextDecoration', () => {
  describe('convertTextDecoration - Valid Values', () => {
    it('should generate the correct CSS rule for "underline"', () => {
      const cssRule = convertTextDecoration('textDecoration__underline');
      expect(cssRule).toBe('.textDecoration__underline { text-decoration: underline; }');
    });

    it('should generate the correct CSS rule for "line-through"', () => {
      const cssRule = convertTextDecoration('textDecoration__line-through');
      expect(cssRule).toBe('.textDecoration__line-through { text-decoration: line-through; }');
    });

    it('should generate the correct CSS rule for "none"', () => {
      const cssRule = convertTextDecoration('textDecoration__none');
      expect(cssRule).toBe('.textDecoration__none { text-decoration: none; }');
    });
  });

  describe('convertTextDecoration - Exceptions', () => {
    it('should return null for keys with an invalid decoration value', () => {
      const cssRule = convertTextDecoration('textDecoration__overline');
      expect(cssRule).toBeNull();
    });

    it('should return null for keys with no decoration provided', () => {
      const cssRule = convertTextDecoration('textDecoration__');
      expect(cssRule).toBeNull();
    });

    it('should return null for keys with more than one separator', () => {
      const cssRule = convertTextDecoration('textDecoration__underline__dotted');
      expect(cssRule).toBeNull();
    });

    it('should return null for keys that do not start with "textDecoration__"', () => {
      const cssRule = convertTextDecoration('notTextDecoration__underline');
      expect(cssRule).toBeNull();
    });

    it('should return null for keys that cannot be split correctly', () => {
      const cssRule = convertTextDecoration('textDecoration-underline');
      expect(cssRule).toBeNull();
    });
  });
});
