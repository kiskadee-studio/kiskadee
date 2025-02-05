import type {
  Appearance,
  BorderStyle,
  Cursor,
  FontDecoration,
  FontWeight,
  TextAlign,
  TextTransform
} from '@kiskadee/schema';
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

  describe('fontItalic', () => {
    it('should process fontItalic property set to true', () => {
      const appearance: Appearance = { fontItalic: true };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({
        fontItalic__true: 1
      });
    });

    it('should process fontItalic property set to false', () => {
      const appearance: Appearance = { fontItalic: false };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({
        fontItalic__false: 1
      });
    });
  });

  describe('fontWeight', () => {
    const fontWeights: FontWeight[] = [
      'thin',
      'extra-light',
      'light',
      'normal',
      'medium',
      'semi-bold',
      'bold',
      'extra-bold',
      'black'
    ];

    for (const weight of fontWeights) {
      it(`should process fontWeight property with "${weight}"`, () => {
        const appearance: Appearance = { fontWeight: weight };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({
          [`fontWeight__${weight}`]: 1
        });
      });
    }
  });

  describe('textDecoration', () => {
    const decorations: FontDecoration[] = ['none', 'underline', 'line-through'];

    for (const decoration of decorations) {
      it(`should process textDecoration property with "${decoration}"`, () => {
        const appearance: Appearance = { textDecoration: decoration };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({
          [`textDecoration__${decoration}`]: 1
        });
      });
    }
  });

  describe('textTransform', () => {
    const transforms: TextTransform[] = ['none', 'uppercase', 'lowercase', 'capitalize'];

    for (const transform of transforms) {
      it(`should process textTransform property with "${transform}"`, () => {
        const appearance: Appearance = { textTransform: transform };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({
          [`textTransform__${transform}`]: 1
        });
      });
    }
  });

  describe('textAlign', () => {
    const aligns: TextAlign[] = ['left', 'center', 'right'];

    for (const align of aligns) {
      it(`should process textAlign property with "${align}"`, () => {
        const appearance: Appearance = { textAlign: align };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({
          [`textAlign__${align}`]: 1
        });
      });
    }
  });

  describe('cursor', () => {
    const cursors: Cursor[] = [
      'auto',
      'default',
      'none',
      'context-menu',
      'help',
      'pointer',
      'progress',
      'wait',
      'cell',
      'crosshair',
      'text',
      'vertical-text',
      'alias',
      'copy',
      'move',
      'no-drop',
      'not-allowed',
      'grab',
      'grabbing',
      'all-scroll',
      'col-resize',
      'row-resize',
      'n-resize',
      'e-resize',
      's-resize',
      'w-resize',
      'ne-resize',
      'nw-resize',
      'se-resize',
      'sw-resize',
      'ew-resize',
      'ns-resize',
      'nesw-resize',
      'nwse-resize',
      'zoom-in',
      'zoom-out'
    ];

    for (const cursor of cursors) {
      it(`should process cursor property with "${cursor}"`, () => {
        const appearance: Appearance = { cursor: cursor };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({
          [`cursor__${cursor}`]: 1
        });
      });
    }
  });

  describe('borderStyle', () => {
    const borders: BorderStyle[] = ['none', 'dotted', 'dashed', 'solid'];

    for (const border of borders) {
      it(`should process borderStyle property with "${border}"`, () => {
        const appearance: Appearance = { borderStyle: border };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({
          [`borderStyle__${border}`]: 1
        });
      });
    }
  });

  describe('shadow', () => {
    it('should process shadow-related properties with random values', () => {
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

    it('should return empty when shadowColor is missing', () => {
      const shadow: Appearance = {
        shadowBlur: { rest: 7 },
        shadowY: { rest: 5 }
      };

      processAppearance(shadow as Appearance);

      expect(styleUsageMapMock).toEqual({});
    });

    it('should return empty when shadow numbers are missing', () => {
      const shadow: Appearance = {
        shadowColor: [0, 0, 0, 0.5]
      };

      processAppearance(shadow as Appearance);

      expect(styleUsageMapMock).toEqual({});
    });

    it('should generate a valid shadow when shadowColor and one number are provided', () => {
      const appearance: Appearance = {
        shadowColor: [0, 0, 0, 0.5],
        shadowX: { rest: 4 }
      };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({
        'shadow__4px--0px--0px--rgba-0-0-0-0.5': 1
      });
    });

    it('should generate combined shadows for multiple states', () => {
      const appearance: Appearance = {
        shadowColor: [50, 150, 200, 0.5],
        shadowBlur: { rest: 4, hover: 8 },
        shadowX: { rest: 2, hover: 6 },
        shadowY: { rest: 3, hover: 7 }
      };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({
        'shadow__2px--3px--4px--rgba-50-150-200-0.5': 1,
        'shadow::hover__6px--7px--8px--rgba-50-150-200-0.5': 1
      });
    });
  });
});
