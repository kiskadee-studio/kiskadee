import type { Palettes } from '@kiskadee/schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processPalettes } from './processPalettes';
import { styleUsageMap } from './utils';

// Mock the styleUsageMap to isolate tests
vi.mock('./utils', () => ({
  styleUsageMap: {}
}));

describe('processPalettes', () => {
  let styleUsageMapMock: Record<string, number>;

  beforeEach(() => {
    // Clear the map before each test
    for (const key of Object.keys(styleUsageMap)) {
      delete styleUsageMap[key];
    }
    styleUsageMapMock = styleUsageMap;
  });

  it('should process a palette property without ref', () => {
    const palettes: Palettes = {
      bgColor: {
        primary: {
          rest: [45, 100, 50, 1]
        }
      }
    };

    processPalettes(palettes);

    // For "rest", the key uses the pattern: property + "__" + value
    const expectedKey = 'bgColor__[45,100,50,1]';
    expect(styleUsageMapMock).toEqual({
      [expectedKey]: 1
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

    processPalettes(palettes);

    // For "rest", the key should not include "ref::", even if the value is referenced.
    const expectedRestKey = 'borderColor__[255,255,255,1]';
    // For "hover", the pattern is: property--state::ref__value
    const expectedHoverKey = 'borderColor--hover::ref__[255,255,255,0.1]';
    expect(styleUsageMapMock).toEqual({
      [expectedRestKey]: 1,
      [expectedHoverKey]: 1
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

    processPalettes(palettes);

    const expected = {
      // For textColor - "rest" does not include the state; "hover" uses the pattern with ref.
      'textColor__[120,50,50,1]': 1,
      'textColor--hover::ref__[240,50,50,0.5]': 1,
      'textColor__[240,50,50,0.5]': 1,
      // For borderColor - "rest" and "focus" (focus includes ref)
      'borderColor__[0,0,0,0.02]': 1,
      'borderColor--focus::ref__[10,20,30,0.1]': 1
    };

    expect(styleUsageMapMock).toEqual(expected);
  });
});
