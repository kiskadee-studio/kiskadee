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
    it('should process shadow-related properties when all are provided', () => {
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

    it('should not generate shadow output when no shadow properties are provided', () => {
      const appearance: Appearance = {};

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({});
    });

    it('should generate a valid shadow when only shadowColor is provided', () => {
      const appearance: Appearance = {
        shadowColor: [0, 0, 0, 0.5]
      };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({
        'shadow__0px--0px--0px--rgba-0-0-0-0.5': 1
      });
    });

    it('should generate a valid shadow when only shadowX is provided', () => {
      const appearance: Appearance = {
        shadowX: { rest: 4 }
      };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({
        'shadow__4px--0px--0px--rgba-0-0-0-1': 1
      });
    });

    it('should generate a valid shadow with hover state and defaults for missing values', () => {
      const appearance: Appearance = {
        shadowColor: [50, 150, 200, 0.8],
        shadowY: { rest: 3, hover: 7 },
        shadowBlur: { rest: 4 }
      };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({
        'shadow__0px--3px--4px--rgba-50-150-200-0.8': 1,
        'shadow::hover__0px--7px--0px--rgba-50-150-200-0.8': 1
      });
    });

    it('should generate a valid shadow when only shadowBlur is provided', () => {
      const appearance: Appearance = {
        shadowBlur: { rest: 5 }
      };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({
        'shadow__0px--0px--5px--rgba-0-0-0-1': 1
      });
    });

    it('should generate a valid shadow when multiple shadow properties are provided', () => {
      const appearance: Appearance = {
        shadowX: { rest: 3 },
        shadowY: { rest: 5 }
      };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({
        'shadow__3px--5px--0px--rgba-0-0-0-1': 1
      });
    });
  });
});
