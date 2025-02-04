import type { Appearance } from '@kiskadee/schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { styleUsageMap } from './utils';
import { processAppearance } from './web-builder';

vi.mock('./utils', () => ({
  styleUsageMap: {}
}));

describe('processAppearance', () => {
  let styleUsageMapMock: Record<string, number>;

  beforeEach(() => {
    for (const key of Object.keys(styleUsageMap)) {
      delete styleUsageMap[key];
    }
    styleUsageMapMock = styleUsageMap;
  });

  it('should process fontItalic property correctly', () => {
    const appearance: Appearance = { fontItalic: true };

    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      fontItalic__true: 1
    });
  });

  it('should process fontWeight property correctly', () => {
    const appearance: Appearance = { fontWeight: 'bold' };

    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      fontWeight__bold: 1
    });
  });

  it('should process textDecoration property correctly', () => {
    const appearance: Appearance = { textDecoration: 'underline' };

    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      textDecoration__underline: 1
    });
  });

  it('should process textTransform property correctly', () => {
    const appearance: Appearance = { textTransform: 'uppercase' };

    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      textTransform__uppercase: 1
    });
  });

  it('should process cursor property correctly', () => {
    const appearance: Appearance = { cursor: 'pointer' };

    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      cursor__pointer: 1
    });
  });

  it('should process borderStyle property correctly', () => {
    const appearance: Appearance = { borderStyle: 'solid' };

    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      borderStyle__solid: 1
    });
  });

  it('should process shadow-related properties correctly', () => {
    const appearance: Appearance = {
      shadowColor: [255, 0, 0, 0.5],
      shadowBlur: { rest: 5, hover: 10 },
      shadowX: { rest: 2, hover: 4 },
      shadowY: { rest: 3, hover: 6 }
    };

    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      'shadow__2px--3px--5px--rgba-255-0-0-0.5': 1,
      'shadow::hover__4px--6px--10px--rgba-255-0-0-0.5': 1
    });
  });

  it('should not add shadow properties if no shadow-related input is provided', () => {
    const appearance: Appearance = { fontItalic: false };

    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      fontItalic__false: 1
    });
  });

  it('should increment counts for repeated appearance properties', () => {
    const appearance: Appearance = { fontItalic: true };

    processAppearance(appearance);
    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      fontItalic__true: 2
    });
  });

  it('should process mixed appearance properties correctly', () => {
    const appearance: Appearance = {
      fontItalic: true,
      fontWeight: 'bold',
      textDecoration: 'underline',
      cursor: 'pointer'
    };

    processAppearance(appearance);

    expect(styleUsageMapMock).toEqual({
      fontItalic__true: 1,
      fontWeight__bold: 1,
      textDecoration__underline: 1,
      cursor__pointer: 1
    });
  });
});
