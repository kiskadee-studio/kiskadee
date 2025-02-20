import type {
  Appearance,
  Cursor,
  TextAlign,
  TextDecoration,
  TextTransform,
  TextWeight
} from '@kiskadee/schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processAppearance } from './processAppearance';
import { styleUsageMap } from './utils';

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

  describe('textItalic', () => {
    it('should process textItalic property set to true', () => {
      const appearance: Appearance = { textItalic: true };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({ textItalic__true: 1 });
    });

    it('should process textItalic property set to false', () => {
      const appearance: Appearance = { textItalic: false };

      processAppearance(appearance);

      expect(styleUsageMapMock).toEqual({ textItalic__false: 1 });
    });
  });

  describe('textWeight', () => {
    const textWeights: TextWeight[] = [
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

    for (const weight of textWeights) {
      it(`should process textWeight property with "${weight}"`, () => {
        const appearance: Appearance = { textWeight: weight };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({ [`textWeight__${weight}`]: 1 });
      });
    }
  });

  describe('textDecoration', () => {
    const decorations: TextDecoration[] = ['none', 'underline', 'line-through'];

    for (const decoration of decorations) {
      it(`should process textDecoration property with "${decoration}"`, () => {
        const appearance: Appearance = { textDecoration: decoration };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({ [`textDecoration__${decoration}`]: 1 });
      });
    }
  });

  describe('textTransform', () => {
    const transforms: TextTransform[] = ['none', 'uppercase', 'lowercase', 'capitalize'];

    for (const transform of transforms) {
      it(`should process textTransform property with "${transform}"`, () => {
        const appearance: Appearance = { textTransform: transform };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({ [`textTransform__${transform}`]: 1 });
      });
    }
  });

  describe('textAlign', () => {
    const aligns: TextAlign[] = ['left', 'center', 'right'];

    for (const align of aligns) {
      it(`should process textAlign property with "${align}"`, () => {
        const appearance: Appearance = { textAlign: align };

        processAppearance(appearance);

        expect(styleUsageMapMock).toEqual({ [`textAlign__${align}`]: 1 });
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

        expect(styleUsageMapMock).toEqual({ [`cursor__${cursor}`]: 1 });
      });
    }
  });

  describe('shadow properties', () => {
    it('should inherit missing shadow properties from the rest state', () => {
      // "rest" defines all shadow properties.
      // "hover" only defines shadowX.
      // Expected: For hover, the missing properties should come from "rest"
      const appearance: Appearance = {
        shadowX: { rest: 10, hover: 20 },
        shadowY: { rest: 15 },
        shadowBlur: { rest: 5 },
        shadowColor: { rest: [0, 0, 0, 0.5] }
      };

      processAppearance(appearance);

      const restKey = 'shadow__10px--15px--5px--hlsa-0-0-0-0.5';
      const hoverKey = 'shadow::hover__20px--15px--5px--hlsa-0-0-0-0.5';

      expect(styleUsageMapMock[restKey]).toBe(1);
      expect(styleUsageMapMock[hoverKey]).toBe(1);
    });

    it('should use default values when missing in both specific state and rest', () => {
      // Only shadowX is set for "hover".
      // Expected: For "hover" state, shadowY and shadowBlur default to 0, and shadowColor defaults to [0,0,0,1].
      // Also, the "rest" state is processed with default values.
      const appearance: Appearance = {
        shadowX: { hover: 25 }
      };

      processAppearance(appearance);

      const hoverKey = 'shadow::hover__25px--0px--0px--hlsa-0-0-0-1';
      const restKey = 'shadow__0px--0px--0px--hlsa-0-0-0-1';

      expect(styleUsageMapMock[hoverKey]).toBe(1);
      expect(styleUsageMapMock[restKey]).toBe(1);
    });

    it('should process multiple interaction states with proper inheritance', () => {
      // "rest" defines complete shadow values.
      // "focus" defines its own shadowX and shadowY.
      // "hover" defines shadowY and shadowColor.
      // Expected: missing values inherit from "rest"
      const appearance: Appearance = {
        shadowX: { rest: 5, focus: 12 },
        shadowY: { rest: 8, focus: 16, hover: 10 },
        shadowBlur: { rest: 3 },
        shadowColor: { rest: [10, 20, 30, 0.8], hover: [50, 60, 70, 0.9] }
      };

      processAppearance(appearance);

      const restKey = 'shadow__5px--8px--3px--hlsa-10-20-30-0.8';
      const focusKey = 'shadow::focus__12px--16px--3px--hlsa-10-20-30-0.8';
      const hoverKey = 'shadow::hover__5px--10px--3px--hlsa-50-60-70-0.9';

      expect(styleUsageMapMock[restKey]).toBe(1);
      expect(styleUsageMapMock[focusKey]).toBe(1);
      expect(styleUsageMapMock[hoverKey]).toBe(1);
    });
  });
});
