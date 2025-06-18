import type { Palettes } from '@kiskadee/schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { convertPalettesToStyleKey } from './convertPalettesToStyleKey';
import { styleKeyUsageMap } from '../../utils';

vi.mock('./utils', () => ({
  styleUsageMap: {}
}));

describe('convertPalettesToStyleKey', () => {
  let styleUsageMapMock: Record<string, number>;

  beforeEach(() => {
    // Clear the map before each test
    for (const styleKey of Object.keys(styleKeyUsageMap)) {
      delete styleKeyUsageMap[styleKey];
    }
    styleUsageMapMock = styleKeyUsageMap;
  });

  it('should process a palette property without ref', () => {
    const palettes: Palettes = {
      bgColor: {
        primary: {
          rest: [45, 100, 50, 1]
        }
      }
    };

    convertPalettesToStyleKey(palettes);

    // For "rest", the key uses the pattern: property + "__" + value
    expect(styleUsageMapMock).toEqual({
      'bgColor__[45,100,50,1]': 1
    });
  });

  it('should process a palette property with a ref value', () => {
    const palettes: Palettes = {
      borderColor: {
        primary: {
          rest: [255, 255, 255, 1],
          hover: { ref: [255, 255, 255, 0.1] }
        }
      }
    };

    convertPalettesToStyleKey(palettes);

    // For "rest", the key should not include "ref::", even if the value is referenced.
    // For "hover", the pattern is: property--state::ref__value
    expect(styleUsageMapMock).toEqual({
      'borderColor__[255,255,255,1]': 1,
      'borderColor--hover::ref__[255,255,255,0.1]': 1
    });
  });

  it('should process multiple palette entries', () => {
    const palettes: Palettes = {
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
        danger: {
          rest: [0, 0, 0, 0.02],
          focus: { ref: [10, 20, 30, 0.1] }
        }
      }
    };

    convertPalettesToStyleKey(palettes);

    expect(styleUsageMapMock).toEqual({
      // For textColor - "rest" does not include the state; "hover" uses the pattern with ref.
      'textColor__[120,50,50,1]': 1,
      'textColor--hover::ref__[240,50,50,0.5]': 1,
      'textColor__[240,50,50,0.5]': 1,
      // For borderColor - "rest" and "focus" (focus includes ref)
      'borderColor__[0,0,0,0.02]': 1,
      'borderColor--focus::ref__[10,20,30,0.1]': 1
    });
  });
});
