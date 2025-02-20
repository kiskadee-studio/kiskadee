// processAppearance.test.ts
import type { Appearance } from '@kiskadee/schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processAppearance } from './processAppearance';
import { styleUsageMap } from './utils';

// Mock the styleUsageMap to isolate tests.
vi.mock('./utils', () => ({
  styleUsageMap: {}
}));

describe('processAppearance', () => {
  let styleUsageMapMock: Record<string, number>;

  beforeEach(() => {
    // Clear the styleUsageMap before each test.
    Object.keys(styleUsageMap).forEach((key) => {
      delete styleUsageMap[key];
    });
    styleUsageMapMock = styleUsageMap;
  });

  it('should process non‑shadow Appearance properties', () => {
    // Using only the non‑shadow keys from Appearance.
    const appearance: Appearance = {
      textItalic: true,
      textWeight: 'bold',
      textDecoration: 'underline',
      textTransform: 'capitalize',
      textAlign: 'center',
      cursor: 'pointer',
      borderStyle: 'dashed'
    };

    processAppearance(appearance);

    const expected = {
      textItalic__true: 1,
      textWeight__bold: 1,
      textDecoration__underline: 1,
      textTransform__capitalize: 1,
      textAlign__center: 1,
      cursor__pointer: 1,
      borderStyle__dashed: 1
    };

    expect(styleUsageMapMock).toEqual(expected);
  });

  it('should process shadow keys for the default (rest) state only', () => {
    // Using shadow keys only with a "rest" state.
    const appearance: Appearance = {
      shadowX: { rest: 5 },
      shadowY: { rest: 6 },
      shadowBlur: { rest: 3 },
      shadowColor: { rest: [100, 100, 100, 1] }
    };

    processAppearance(appearance);

    const expectedKey = 'shadow__[5,6,3,[100,100,100,1]]';
    expect(styleUsageMapMock).toEqual({
      [expectedKey]: 1
    });
  });

  it('should process combined non‑shadow and shadow properties', () => {
    // Here we combine all Appearance keys.
    // Non-shadow keys:
    const appearance: Appearance = {
      textItalic: false,
      textWeight: 'light',
      textDecoration: 'line-through',
      textTransform: 'lowercase',
      textAlign: 'right',
      cursor: 'grab',
      borderStyle: 'solid',
      // Shadow keys with multiple states using valid InteractionStatesKeys (e.g. "rest" and "hover")
      shadowX: { rest: 2, hover: 4 },
      shadowY: { rest: 3, hover: 5 },
      shadowBlur: { rest: 1, hover: 2 },
      shadowColor: { rest: [50, 50, 50, 1], hover: [200, 200, 200, 0.5] }
    };

    processAppearance(appearance);

    const expectedNonShadow = {
      textItalic__false: 1,
      textWeight__light: 1,
      'textDecoration__line-through': 1,
      textTransform__lowercase: 1,
      textAlign__right: 1,
      cursor__grab: 1,
      borderStyle__solid: 1
    };

    const expectedShadowRest = 'shadow__[2,3,1,[50,50,50,1]]';
    const expectedShadowHover = 'shadow--hover__[4,5,2,[200,200,200,0.5]]';

    expect(styleUsageMapMock).toEqual({
      ...expectedNonShadow,
      [expectedShadowRest]: 1,
      [expectedShadowHover]: 1
    });
  });
});
