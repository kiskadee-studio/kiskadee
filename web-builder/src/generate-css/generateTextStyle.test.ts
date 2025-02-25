import { describe, expect, it } from 'vitest';
import { generateTextStyle } from './generateTextStyle';

describe('generateTextStyle', () => {
  it('should generate the correct CSS rule for "textItalic__true"', () => {
    const key = 'textItalic__true';
    const cssRule = generateTextStyle(key);
    expect(cssRule).toBe(`.${key} { font-style: italic; }`);
  });

  it('should generate the correct CSS rule for "textItalic__false"', () => {
    const key = 'textItalic__false';
    // Here, since the value is not "true", it should default to normal.
    const cssRule = generateTextStyle(key);
    expect(cssRule).toBe(`.${key} { font-style: normal; }`);
  });

  it('should return null for keys that do not start with "textItalic__"', () => {
    const key = 'notTextItalic__true';
    const cssRule = generateTextStyle(key);
    expect(cssRule).toBeNull();
  });

  it('should return null for keys that cannot be split correctly', () => {
    const key = 'textItalictrue'; // Missing separator "__"
    const cssRule = generateTextStyle(key);
    expect(cssRule).toBeNull();
  });

  it('should return null for keys that do not end with a valid value ("true" or "false")', () => {
    const key = 'textItalic__false_';
    const cssRule = generateTextStyle(key);
    expect(cssRule).toBeNull();
  });
});
