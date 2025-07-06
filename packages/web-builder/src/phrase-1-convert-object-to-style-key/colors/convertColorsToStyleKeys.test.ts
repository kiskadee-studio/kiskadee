import type { ColorSchema, PaletteSchema } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { convertColorsToStyleKeys } from './convertColorsToStyleKeys';

describe('convertColorsToStyleKeys', () => {
  it('should process a palette property without ref', () => {
    const palettes: PaletteSchema = {
      p1: {
        boxColor: {
          primary: {
            rest: [45, 100, 50, 1]
          }
        }
      }
    };

    const result = convertColorsToStyleKeys(palettes);

    expect(result).toEqual({
      p1: {
        primary: {
          rest: ['boxColor__[45,100,50,1]']
        }
      }
    });
  });

  it('should process a palette property with a ref value', () => {
    const palettes: PaletteSchema = {
      p1: {
        borderColor: {
          primary: {
            rest: [255, 255, 255, 1],
            hover: { ref: [255, 255, 255, 0.1] }
          }
        }
      }
    };

    const result = convertColorsToStyleKeys(palettes);

    expect(result).toEqual({
      p1: {
        primary: {
          rest: ['borderColor__[255,255,255,1]'],
          hover: ['borderColor--hover::ref__[255,255,255,0.1]']
        }
      }
    });
  });

  it('should process multiple palette entries', () => {
    const palettes: PaletteSchema = {
      p1: {
        textColor: {
          primary: {
            rest: [120, 50, 50, 1],
            hover: { ref: [240, 50, 50, 0.5] }
          },
          secondary: {
            rest: [240, 50, 50, 0.5]
          }
        },
        borderColor: {
          primary: {
            rest: [120, 50, 50, 1]
          },
          danger: {
            rest: [0, 0, 0, 0.02],
            focus: { ref: [10, 20, 30, 0.1] }
          }
        }
      }
    };

    const result = convertColorsToStyleKeys(palettes);

    expect(result).toEqual({
      p1: {
        primary: {
          rest: ['textColor__[120,50,50,1]', 'borderColor__[120,50,50,1]'],
          hover: ['textColor--hover::ref__[240,50,50,0.5]']
        },
        secondary: {
          rest: ['textColor__[240,50,50,0.5]']
        },
        danger: {
          rest: ['borderColor__[0,0,0,0.02]'],
          focus: ['borderColor--focus::ref__[10,20,30,0.1]']
        }
      }
    });
  });
});
