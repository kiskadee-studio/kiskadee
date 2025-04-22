import type { Appearance } from '@kiskadee/schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { convertAppearanceToKeys } from './convertAppearanceToKeys';
import { styleUsageMap } from '../../utils';

vi.mock('./utils', () => ({
  styleUsageMap: {}
}));

describe('convertAppearanceToKeys', () => {
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

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textItalic__true: 1 });
    });

    it('should process textItalic property set to false', () => {
      const appearance: Appearance = { textItalic: false };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textItalic__false: 1 });
    });
  });

  describe('textWeight', () => {
    it('should process textWeight property with "thin"', () => {
      const appearance: Appearance = { textWeight: 'thin' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textWeight__thin: 1 });
    });

    it('should process textWeight property with "extra-light"', () => {
      const appearance: Appearance = { textWeight: 'extraLight' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textWeight__extraLight: 1 });
    });

    it('should process textWeight property with "light"', () => {
      const appearance: Appearance = { textWeight: 'light' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textWeight__light: 1 });
    });

    it('should process textWeight property with "normal"', () => {
      const appearance: Appearance = { textWeight: 'normal' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textWeight__normal: 1 });
    });

    it('should process textWeight property with "medium"', () => {
      const appearance: Appearance = { textWeight: 'medium' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textWeight__medium: 1 });
    });

    it('should process textWeight property with "semi-bold"', () => {
      const appearance: Appearance = { textWeight: 'semiBold' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textWeight__semiBold: 1 });
    });

    it('should process textWeight property with "bold"', () => {
      const appearance: Appearance = { textWeight: 'bold' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textWeight__bold: 1 });
    });

    it('should process textWeight property with "extra-bold"', () => {
      const appearance: Appearance = { textWeight: 'extraBold' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textWeight__extraBold: 1 });
    });

    it('should process textWeight property with "black"', () => {
      const appearance: Appearance = { textWeight: 'black' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textWeight__black: 1 });
    });
  });

  describe('textDecoration', () => {
    it('should process textDecoration property with "none"', () => {
      const appearance: Appearance = { textDecoration: 'none' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textDecoration__none: 1 });
    });

    it('should process textDecoration property with "underline"', () => {
      const appearance: Appearance = { textDecoration: 'underline' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textDecoration__underline: 1 });
    });

    it('should process textDecoration property with "line-through"', () => {
      const appearance: Appearance = { textDecoration: 'lineThrough' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textDecoration__lineThrough: 1 });
    });
  });

  // describe('textTransform', () => {
  //   it('should process textTransform property with "none"', () => {
  //     const appearance: Appearance = { textTransform: 'none' };
  //
  //     convertAppearanceToKeys(appearance);
  //
  //     expect(styleUsageMapMock).toEqual({ textTransform__none: 1 });
  //   });
  //
  //   it('should process textTransform property with "uppercase"', () => {
  //     const appearance: Appearance = { textTransform: 'uppercase' };
  //
  //     convertAppearanceToKeys(appearance);
  //
  //     expect(styleUsageMapMock).toEqual({ textTransform__uppercase: 1 });
  //   });
  //
  //   it('should process textTransform property with "lowercase"', () => {
  //     const appearance: Appearance = { textTransform: 'lowercase' };
  //
  //     convertAppearanceToKeys(appearance);
  //
  //     expect(styleUsageMapMock).toEqual({ textTransform__lowercase: 1 });
  //   });
  //
  //   it('should process textTransform property with "capitalize"', () => {
  //     const appearance: Appearance = { textTransform: 'capitalize' };
  //
  //     convertAppearanceToKeys(appearance);
  //
  //     expect(styleUsageMapMock).toEqual({ textTransform__capitalize: 1 });
  //   });
  // });

  describe('textAlign', () => {
    it('should process textAlign property with "left"', () => {
      const appearance: Appearance = { textAlign: 'left' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textAlign__left: 1 });
    });

    it('should process textAlign property with "center"', () => {
      const appearance: Appearance = { textAlign: 'center' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textAlign__center: 1 });
    });

    it('should process textAlign property with "right"', () => {
      const appearance: Appearance = { textAlign: 'right' };

      convertAppearanceToKeys(appearance);

      expect(styleUsageMapMock).toEqual({ textAlign__right: 1 });
    });
  });

  // describe('cursor', () => {
  //   const cursors: Cursor[] = [
  //     'auto',
  //     'default',
  //     'none',
  //     'context-menu',
  //     'help',
  //     'pointer',
  //     'progress',
  //     'wait',
  //     'cell',
  //     'crosshair',
  //     'text',
  //     'vertical-text',
  //     'alias',
  //     'copy',
  //     'move',
  //     'no-drop',
  //     'not-allowed',
  //     'grab',
  //     'grabbing',
  //     'all-scroll',
  //     'col-resize',
  //     'row-resize',
  //     'n-resize',
  //     'e-resize',
  //     's-resize',
  //     'w-resize',
  //     'ne-resize',
  //     'nw-resize',
  //     'se-resize',
  //     'sw-resize',
  //     'ew-resize',
  //     'ns-resize',
  //     'nesw-resize',
  //     'nwse-resize',
  //     'zoom-in',
  //     'zoom-out'
  //   ];
  //
  //   for (const cursor of cursors) {
  //     it(`should process cursor property with "${cursor}"`, () => {
  //       const appearance: Appearance = { cursor: cursor };
  //
  //       convertAppearanceToKeys(appearance);
  //
  //       expect(styleUsageMapMock).toEqual({ [`cursor__${cursor}`]: 1 });
  //     });
  //   }
  // });

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

      convertAppearanceToKeys(appearance);

      const restKey = 'shadow__[10,15,5,[0,0,0,0.5]]';
      const hoverKey = 'shadow--hover__[20,15,5,[0,0,0,0.5]]';

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

      convertAppearanceToKeys(appearance);

      const hoverKey = 'shadow--hover__[25,0,0,[0,0,0,1]]';
      const restKey = 'shadow__[0,0,0,[0,0,0,1]]';

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

      convertAppearanceToKeys(appearance);

      const restKey = 'shadow__[5,8,3,[10,20,30,0.8]]';
      const focusKey = 'shadow--focus__[12,16,3,[10,20,30,0.8]]';
      const hoverKey = 'shadow--hover__[5,10,3,[50,60,70,0.9]]';

      expect(styleUsageMapMock[restKey]).toBe(1);
      expect(styleUsageMapMock[focusKey]).toBe(1);
      expect(styleUsageMapMock[hoverKey]).toBe(1);
    });
  });
});
