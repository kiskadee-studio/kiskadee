import type { Dimensions } from '@kiskadee/schema';
import { beforeEach, describe, expect, it } from 'vitest';
import { processDimensions } from './processDimensions';
import { styleUsageMap } from './utils';

describe('processDimensions', () => {
  beforeEach(() => {
    // Clear the styleUsageMap before each test
    for (const key in styleUsageMap) {
      delete styleUsageMap[key];
    }
  });

  it('should process a direct numeric dimension property', () => {
    const dimensions: Dimensions = {
      paddingTop: 10
    };

    processDimensions(dimensions);

    expect(styleUsageMap).toEqual({
      paddingTop__10: 1
    });
  });

  it('should process a dimension property provided as a direct number (no object)', () => {
    const dimensions: Dimensions = {
      fontSize: 16
    };

    processDimensions(dimensions);

    expect(styleUsageMap).toEqual({
      fontSize__16: 1
    });
  });

  it('should process a dimension property with a responsive breakpoint', () => {
    const dimensions: Dimensions = {
      fontSize: { sm: 14 }
    };

    processDimensions(dimensions);

    expect(styleUsageMap).toEqual({
      'fontSize--sm__14': 1
    });
  });

  it('should process a dimension property with nested breakpoints', () => {
    const dimensions: Dimensions = {
      fontSize: { md: { all: 16, lg2: 10 } }
    };

    processDimensions(dimensions);

    expect(styleUsageMap).toEqual({
      'fontSize--md__16': 1, // updated key for "all" breakpoint
      'fontSize--md::lg2__10': 1
    });
  });

  it('should process multiple dimension properties together', () => {
    const dimensions: Dimensions = {
      fontSize: { md: 16 },
      paddingBottom: { md: 8 },
      marginTop: 20
    };

    processDimensions(dimensions);

    expect(styleUsageMap).toEqual({
      'fontSize--md__16': 1,
      'paddingBottom--md__8': 1,
      marginTop__20: 1
    });
  });
});
