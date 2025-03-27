import type { Dimensions } from '@kiskadee/schema';
import { beforeEach, describe, expect, it } from 'vitest';
import { convertDimensionsToKeys } from './convertDimensionsToKeys';
import { styleUsageMap } from '../../utils';

describe('convertDimensionsToKeys function', () => {
  beforeEach(() => {
    // Clear the styleUsageMap before each test
    for (const key in styleUsageMap) {
      delete styleUsageMap[key];
    }
  });

  it('correctly converts a direct numeric dimension property', () => {
    const dimensions: Dimensions = {
      paddingTop: 10
    };

    convertDimensionsToKeys(dimensions);

    expect(styleUsageMap).toEqual({
      paddingTop__10: 1
    });
  });

  it('correctly converts a dimension property provided as a direct number (no object)', () => {
    const dimensions: Dimensions = {
      textSize: 16
    };

    convertDimensionsToKeys(dimensions);

    expect(styleUsageMap).toEqual({
      textSize__16: 1
    });
  });

  it('correctly converts a dimension property without responsive breakpoints (ignoring size tokens)', () => {
    const dimensions: Dimensions = {
      textSize: { 's:md:1': 14 }
    };

    convertDimensionsToKeys(dimensions);

    expect(styleUsageMap).toEqual({
      textSize__14: 1
    });
  });

  it('correctly converts a dimension property with nested responsive breakpoint overrides, treating "s:md:1" with "bp:all" as default', () => {
    const dimensions: Dimensions = {
      textSize: { 's:md:1': { 'bp:all': 16, 'bp:lg:2': 10 } }
    };

    convertDimensionsToKeys(dimensions);

    expect(styleUsageMap).toEqual({
      // For 'bp:all' with "s:md:1", the size token is removed.
      textSize__16: 1,
      // For other breakpoints, include the size token.
      'textSize--s:md:1::bp:lg:2__10': 1
    });
  });

  it('correctly converts multiple dimension properties together', () => {
    const dimensions: Dimensions = {
      textSize: {
        's:sm:1': { 'bp:all': 14, 'bp:lg:1': 12 },
        's:md:1': { 'bp:all': 16, 'bp:lg:1': 14 }
      },
      paddingBottom: { 's:md:1': { 'bp:sm:1': 10, 'bp:lg:2': 8 } },
      marginTop: 20
    };

    convertDimensionsToKeys(dimensions);

    expect(styleUsageMap).toEqual({
      marginTop__20: 1,
      'paddingBottom--s:md:1::bp:lg:2__8': 1,
      'paddingBottom--s:md:1::bp:sm:1__10': 1,
      'textSize--s:md:1::bp:lg:1__14': 1,
      'textSize--s:sm:1::bp:lg:1__12': 1,
      textSize__14: 1,
      textSize__16: 1
    });
  });
});
