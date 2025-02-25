import { describe, expect, it } from 'vitest';
import { convertFontStyle } from './convertTextStyle';

describe('convertTextItalic', () => {
  it('should generate the correct CSS rule for "textItalic__true"', () => {
    const key = 'textItalic__true';
    const cssRule = convertFontStyle(key);
    expect(cssRule).toBe(`.${key} { font-style: italic; }`);
  });

  it('should generate the correct CSS rule for "textItalic__false"', () => {
    const key = 'textItalic__false';
    const cssRule = convertFontStyle(key);
    expect(cssRule).toBe(`.${key} { font-style: normal; }`);
  });

  it('should return null for keys that do not start with "textItalic__"', () => {
    const key = 'notTextItalic__true';
    const cssRule = convertFontStyle(key);
    expect(cssRule).toBeNull();
  });

  it('should return null for keys that cannot be split correctly', () => {
    const key = 'textItalictrue'; // Missing separator "__"
    const cssRule = convertFontStyle(key);
    expect(cssRule).toBeNull();
  });

  it('should return null for keys that do not have a valid value ("true" or "false")', () => {
    const key = 'textItalic__center';
    const cssRule = convertFontStyle(key);
    expect(cssRule).toBeNull();
  });
});
