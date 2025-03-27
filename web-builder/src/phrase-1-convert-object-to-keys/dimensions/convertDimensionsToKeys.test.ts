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

  it('correctly converts a dimension property with nested responsive breakpoint overrides', () => {
    const dimensions: Dimensions = {
      textSize: { 's:md:1': { 'bp:all': 16, 'bp:lg:2': 10 } }
    };

    convertDimensionsToKeys(dimensions);

    expect(styleUsageMap).toEqual({
      'textSize--s:md:1::bp:all__16': 1, // updated key for "bp:all" breakpoint
      'textSize--s:md:1::bp:lg:2__10': 1
    });
  });

  it('correctly converts multiple dimension properties together', () => {
    const dimensions: Dimensions = {
      textSize: { 's:sm:1': 16 },
      paddingBottom: { 's:md:1': 8 },
      marginTop: 20
    };

    convertDimensionsToKeys(dimensions);

    expect(styleUsageMap).toEqual({
      textSize__16: 1,
      paddingBottom__8: 1,
      marginTop__20: 1
    });
  });
});
