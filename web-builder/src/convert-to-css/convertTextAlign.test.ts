import { describe, expect, it } from 'vitest';
import { convertTextAlign } from './convertTextAlign';

describe('convertTextAlign', () => {
  it('should correctly convert a valid text alignment key for left alignment', () => {
    const key = 'textAlign__left';
    const expected = '.textAlign__left { text-align: left; }';
    expect(convertTextAlign(key)).toBe(expected);
  });

  it('should correctly convert a valid text alignment key for center alignment', () => {
    const key = 'textAlign__center';
    const expected = '.textAlign__center { text-align: center; }';
    expect(convertTextAlign(key)).toBe(expected);
  });

  it('should correctly convert a valid text alignment key for right alignment', () => {
    const key = 'textAlign__right';
    const expected = '.textAlign__right { text-align: right; }';
    expect(convertTextAlign(key)).toBe(expected);
  });

  it('should correctly convert a valid text alignment key for justify alignment', () => {
    const key = 'textAlign__justify';
    const expected = '.textAlign__justify { text-align: justify; }';
    expect(convertTextAlign(key)).toBe(expected);
  });

  it('should return null for a valid prefix with an unsupported alignment value', () => {
    const key = 'textAlign__top';
    expect(convertTextAlign(key)).toBeNull();
  });

  it('should return null for a key with an invalid prefix', () => {
    const key = 'alignText__center';
    expect(convertTextAlign(key)).toBeNull();
  });

  it('should return null for a key with missing separators', () => {
    const key = 'textAligncenter';
    expect(convertTextAlign(key)).toBeNull();
  });

  it('should return null for a key with extra separators', () => {
    const key = 'textAlign__center__extra';
    expect(convertTextAlign(key)).toBeNull();
  });
});
