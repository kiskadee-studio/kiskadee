import type { ElementColors } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { convertElementColorsToStyleKeys } from './convertElementColorsToStyleKeys';

/*------------------------------------------------------------------------------------------------*/
/* There is no error handling here; errors were handled during the style key to CSS conversion in
/*   phase 4
/*------------------------------------------------------------------------------------------------*/

describe('convertElementColorsToStyleKeys', () => {
  it('generates style keys for palette property without reference', () => {
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
    expect(result.element).toEqual({
      p1: {
        primary: {
          rest: ['boxColor--rest__[45,100,50,1]']
        }
      }
    });
    expect(result.element).toMatchSnapshot();
  });

  it('generates style keys for palette property with a reference value', () => {
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
    expect(result.element).toEqual({
      p1: {
        primary: {
          rest: ['borderColor--rest__[255,255,255,1]'],
          hover: ['borderColor==hover__[255,255,255,0.1]']
        }
      }
    });
    expect(result.element).toMatchSnapshot();
  });

  it('generates style keys for multiple palette entries', () => {
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
    expect(result.element).toEqual({
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
    expect(result.element).toMatchSnapshot();
  });

  it('treats direct interaction-state map as neutral semantic color', () => {
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
    expect(result.element).toEqual({
      p1: {
        neutral: {
          rest: ['boxColor--rest__[0,128,255,1]'],
          hover: ['boxColor==hover__[0,128,255,0.5]']
        }
      }
    });
    expect(result.element).toMatchSnapshot();
  });

  it('includes parent style keys when only reference interaction states are provided', () => {
    const elementColors: ElementColors = {
      p1: {
        boxColor: {
          primary: {
            rest: [0, 128, 255, 1],
            hover: { ref: [10, 20, 30, 1] },
            focus: { ref: [40, 50, 60, 0.5] }
          }
        }
      }
    };
    const result = convertElementColorsToStyleKeys(elementColors);

    expect(result.element).toEqual({
      p1: {
        primary: {
          rest: ['boxColor--rest__[0,128,255,1]'],
          hover: ['boxColor==hover__[10,20,30,1]'],
          focus: ['boxColor==focus__[40,50,60,0.5]']
        }
      }
    });

    expect(result.parent).toEqual(['==hover', '==focus']);
    expect(result).toMatchSnapshot();
  });
});
