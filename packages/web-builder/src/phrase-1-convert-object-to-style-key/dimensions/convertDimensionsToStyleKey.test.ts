import type { ScaleSchema } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { convertDimensionsToStyleKey } from './convertDimensionsToStyleKey';

describe('convertDimensionsToStyleKey', () => {
  const component = 'button';
  const element = 'e1';

  it('should generate paddingTop 10 style key for numeric value', () => {
    const scale: ScaleSchema = { paddingTop: 10 };
    const result = convertDimensionsToStyleKey(component, element, scale);
    expect(result).toEqual({
      button: {
        e1: {
          rest: ['paddingTop__10']
        }
      }
    });
  });

  it('should generate textSize 16 style key when provided as a direct number', () => {
    const scale: ScaleSchema = { textSize: 16 };
    const result = convertDimensionsToStyleKey(component, element, scale);
    expect(result).toEqual({
      button: {
        e1: {
          rest: ['textSize__16']
        }
      }
    });
  });

  it('should generate textSize__14 style key when given as a size token without breakpoints', () => {
    const scale: ScaleSchema = { textSize: { 's:md:1': 14 } };
    const result = convertDimensionsToStyleKey(component, element, scale);
    expect(result).toEqual({
      button: {
        e1: {
          rest: ['textSize__14']
        }
      }
    });
  });

  it('should generate default and breakpoint style keys for nested responsive overrides', () => {
    const scale: ScaleSchema = {
      textSize: { 's:md:1': { 'bp:all': 16, 'bp:lg:2': 10 } }
    };
    const result = convertDimensionsToStyleKey(component, element, scale);
    expect(result).toEqual({
      button: {
        e1: {
          rest: ['textSize__16', 'textSize--s:md:1::bp:lg:2__10']
        }
      }
    });
  });

  it('should generate style keys for textSize, paddingBottom and marginTop together', () => {
    const scale: ScaleSchema = {
      textSize: {
        's:sm:1': { 'bp:all': 14, 'bp:lg:1': 12 },
        's:md:1': { 'bp:all': 16, 'bp:lg:1': 14 }
      },
      paddingBottom: { 's:md:1': { 'bp:sm:1': 10, 'bp:lg:2': 8 } },
      marginTop: 20
    };
    const result = convertDimensionsToStyleKey(component, element, scale);
    expect(result).toEqual({
      button: {
        e1: {
          rest: [
            'textSize__14',
            'textSize--s:sm:1::bp:lg:1__12',
            'textSize__16',
            'textSize--s:md:1::bp:lg:1__14',
            'paddingBottom--s:md:1::bp:sm:1__10',
            'paddingBottom--s:md:1::bp:lg:2__8',
            'marginTop__20'
          ]
        }
      }
    });
  });
});
