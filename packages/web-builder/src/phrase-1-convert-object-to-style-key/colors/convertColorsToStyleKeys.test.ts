import type { PaletteSchema } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { convertColorsToStyleKeys } from './convertColorsToStyleKeys';

describe('convertColorsToStyleKeys', () => {
  it('generates style keys for palette property without reference', () => {
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
          rest: ['boxColor--rest__[45,100,50,1]']
        }
      }
    });
    expect(result).toMatchSnapshot();
  });

  it('generates style keys for palette property with a reference value', () => {
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
          rest: ['borderColor--rest__[255,255,255,1]'],
          hover: ['borderColor==hover__[255,255,255,0.1]']
        }
      }
    });
    expect(result).toMatchSnapshot();
  });

  it('generates style keys for multiple palette entries', () => {
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
          rest: ['textColor--rest__[120,50,50,1]', 'borderColor--rest__[120,50,50,1]'],
          hover: ['textColor==hover__[240,50,50,0.5]']
        },
        secondary: {
          rest: ['textColor--rest__[240,50,50,0.5]']
        },
        danger: {
          rest: ['borderColor--rest__[0,0,0,0.02]'],
          focus: ['borderColor==focus__[10,20,30,0.1]']
        }
      }
    });
    expect(result).toMatchSnapshot();
  });

  it('treats direct interaction-state map as neutral semantic color', () => {
    const palettes: PaletteSchema = {
      p1: {
        // Direct interaction‐state map: no semantic keys, should map to "neutral"
        boxColor: {
          rest: [0, 128, 255, 1],
          hover: { ref: [0, 128, 255, 0.5] }
        }
      }
    };

    const result = convertColorsToStyleKeys(palettes);

    expect(result).toEqual({
      p1: {
        neutral: {
          rest: ['boxColor--rest__[0,128,255,1]'],
          hover: ['boxColor==hover__[0,128,255,0.5]']
        }
      }
    });
    expect(result).toMatchSnapshot();
  });
});
