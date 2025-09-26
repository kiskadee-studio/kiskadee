import type { ElementColors } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { convertElementColorsToStyleKeys } from './convertElementColorsToStyleKeys';

/*------------------------------------------------------------------------------------------------*/
/* There is no error handling here; errors were handled during the style key to CSS conversion in
/*   phase 4
/*------------------------------------------------------------------------------------------------*/

describe('convertElementColorsToStyleKeys', () => {
  it('generates style keys for palette property without reference', (): void => {
    const elementColors: ElementColors = {
      p1: {
        boxColor: {
          primary: {
            rest: [45, 100, 50, 1]
          }
        }
      }
    };
    const result = convertElementColorsToStyleKeys(elementColors);
    expect(result).toEqual({
      p1: {
        primary: {
          rest: ['boxColor--rest__[45,100,50,1]']
        }
      }
    });
  });

  it('generates style keys for palette property with a reference value', (): void => {
    const elementColors: ElementColors = {
      p1: {
        borderColor: {
          primary: {
            rest: [255, 255, 255, 1],
            hover: { ref: [255, 255, 255, 0.1] }
          }
        }
      }
    };
    const result = convertElementColorsToStyleKeys(elementColors);
    expect(result).toEqual({
      p1: {
        primary: {
          rest: ['borderColor--rest__[255,255,255,1]'],
          hover: ['borderColor==hover__[255,255,255,0.1]']
        }
      }
    });
  });

  it('generates style keys for multiple palette entries', (): void => {
    const elementColors: ElementColors = {
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
    const result = convertElementColorsToStyleKeys(elementColors);
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
  });

  it('treats direct interaction-state map as neutral semantic color', (): void => {
    const elementColors: ElementColors = {
      p1: {
        // Direct interaction‐state map: no semantic keys, should map to "neutral"
        boxColor: {
          rest: [0, 128, 255, 1],
          hover: { ref: [0, 128, 255, 0.5] }
        }
      }
    };
    const result = convertElementColorsToStyleKeys(elementColors);
    expect(result).toEqual({
      p1: {
        neutral: {
          rest: ['boxColor--rest__[0,128,255,1]'],
          hover: ['boxColor==hover__[0,128,255,0.5]']
        }
      }
    });
  });
  it('handles selected submap: emits selected/rest and selected:hover keys', (): void => {
    const elementColors: ElementColors = {
      p1: {
        boxColor: {
          primary: {
            rest: [10, 20, 30, 0.9],
            hover: [15, 25, 35, 0.9],
            selected: {
              rest: [200, 50, 50, 1],
              hover: { ref: [210, 55, 55, 0.8] }
            },
            disabled: [0, 0, 50, 0.5]
          }
        }
      }
    };

    const result = convertElementColorsToStyleKeys(elementColors);

    expect(result).toEqual({
      p1: {
        primary: {
          rest: ['boxColor--rest__[10,20,30,0.9]'],
          hover: ['boxColor--hover__[15,25,35,0.9]'],
          'selected:rest': ['boxColor--selected:rest__[200,50,50,1]'],
          'selected:hover': ['boxColor==selected:hover__[210,55,55,0.8]'],
          disabled: ['boxColor--disabled__[0,0,50,0.5]']
        }
      }
    });
  });
});
