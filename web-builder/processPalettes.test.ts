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
    // Clear the map object before each test
    for (const key of Object.keys(styleUsageMap)) {
      delete styleUsageMap[key];
    }
    styleUsageMapMock = styleUsageMap;
  });

  it('should process a palette property without a ref', () => {
    const palettes: Palettes = {
      bgColor: {
        primary: {
          rest: [45, 100, 50, 1]
        }
      }
    };

    processPalettes(palettes);

    // For "rest", the key omits the state name.
    const expectedKey = `bgColor__${JSON.stringify([45, 100, 50, 1])}`;
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

    const expectedRestKey = `borderColor__${JSON.stringify([255, 255, 255, 1])}`;
    const expectedHoverKey = `borderColor__hover__ref::${JSON.stringify([255, 255, 255, 0.1])}`;
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
      // "rest" state omits its key name.
      [`textColor__${JSON.stringify([120, 50, 50, 1])}`]: 1,
      [`textColor__hover__ref::${JSON.stringify([240, 50, 50, 0.5])}`]: 1,
      [`textColor__${JSON.stringify([240, 50, 50, 0.5])}`]: 1,
      [`borderColor__${JSON.stringify([0, 0, 0, 0.02])}`]: 1,
      [`borderColor__focus__ref::${JSON.stringify([10, 20, 30, 0.1])}`]: 1
    };

    expect(styleUsageMapMock).toEqual(expected);
  });
});
