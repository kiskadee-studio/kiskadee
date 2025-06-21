import type { Appearance } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { convertElementAppearanceToStyleKey } from './convertElementAppearanceToStyleKey';

describe('convertElementAppearanceToStyleKey', () => {
  const component = 'button';
  const element = 'e1';

  describe('textItalic', () => {
    it('should generate textItalic true style key', () => {
      const appearance: Appearance = { textItalic: true };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);

      expect(result).toEqual({
        button: {
          e1: {
            rest: ['textItalic__true']
          }
        }
      });
    });

    it('should generate textItalic false style key', () => {
      const appearance: Appearance = { textItalic: false };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);

      expect(result).toEqual({
        button: {
          e1: {
            rest: ['textItalic__false']
          }
        }
      });
    });
  });

  describe('textWeight', () => {
    it('should generate textWeight thin style key', () => {
      const appearance: Appearance = { textWeight: 'thin' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textWeight__thin']
          }
        }
      });
    });

    it('should generate textWeight extraLight style key', () => {
      const appearance: Appearance = { textWeight: 'extraLight' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textWeight__extraLight']
          }
        }
      });
    });

    it('should generate textWeight light style key', () => {
      const appearance: Appearance = { textWeight: 'light' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textWeight__light']
          }
        }
      });
    });

    it('should generate textWeight normal style key', () => {
      const appearance: Appearance = { textWeight: 'normal' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textWeight__normal']
          }
        }
      });
    });

    it('should generate textWeight medium style key', () => {
      const appearance: Appearance = { textWeight: 'medium' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textWeight__medium']
          }
        }
      });
    });

    it('should generate textWeight semiBold style key', () => {
      const appearance: Appearance = { textWeight: 'semiBold' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textWeight__semiBold']
          }
        }
      });
    });

    it('should generate textWeight bold style key', () => {
      const appearance: Appearance = { textWeight: 'bold' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textWeight__bold']
          }
        }
      });
    });

    it('should generate textWeight extraBold style key', () => {
      const appearance: Appearance = { textWeight: 'extraBold' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textWeight__extraBold']
          }
        }
      });
    });

    it('should generate textWeight black style key', () => {
      const appearance: Appearance = { textWeight: 'black' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textWeight__black']
          }
        }
      });
    });
  });

  describe('textDecoration', () => {
    it('should generate textDecoration none style key', () => {
      const appearance: Appearance = { textDecoration: 'none' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);

      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textDecoration__none']
          }
        }
      });
    });

    it('should generate textDecoration underline style key', () => {
      const appearance: Appearance = { textDecoration: 'underline' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);

      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textDecoration__underline']
          }
        }
      });
    });

    it('should generate textDecoration line-through style key', () => {
      const appearance: Appearance = { textDecoration: 'lineThrough' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);

      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textDecoration__lineThrough']
          }
        }
      });
    });
  });

  describe('textAlign', () => {
    it('should generate textAlign left style key', () => {
      const appearance: Appearance = { textAlign: 'left' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textAlign__left']
          }
        }
      });
    });

    it('should generate textAlign center style key', () => {
      const appearance: Appearance = { textAlign: 'center' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textAlign__center']
          }
        }
      });
    });

    it('should generate textAlign right style key', () => {
      const appearance: Appearance = { textAlign: 'right' };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);
      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['textAlign__right']
          }
        }
      });
    });
  });

  describe('shadow', () => {
    it('should generate shadow style keys inheriting missing properties for rest and hover', () => {
      // "rest" defines all shadow properties.
      // "hover" only defines shadowX.
      // Expected: For hover, the missing properties should come from "rest"
      const appearance: Appearance = {
        shadowX: { rest: 10, hover: 20 },
        shadowY: { rest: 15 },
        shadowBlur: { rest: 5 },
        shadowColor: { rest: [0, 0, 0, 0.5] }
      };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);

      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['shadow__[10,15,5,[0,0,0,0.5]]'],
            hover: ['shadow--hover__[20,15,5,[0,0,0,0.5]]']
          }
        }
      });
    });

    it('should generate style key with shadow default values for rest and hover states', () => {
      // Only shadowX is set for "hover".
      // Expected: For "hover" state, shadowY and shadowBlur default to 0, and shadowColor defaults to [0,0,0,1].
      // Also, the "rest" state is processed with default values.
      const appearance: Appearance = {
        shadowX: { hover: 25 }
      };
      const result = convertElementAppearanceToStyleKey(component, element, appearance);

      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['shadow__[0,0,0,[0,0,0,1]]'],
            hover: ['shadow--hover__[25,0,0,[0,0,0,1]]']
          }
        }
      });
    });

    it('should generate shadow style key with multiple interaction states and proper inheritance', () => {
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
      const result = convertElementAppearanceToStyleKey(component, element, appearance);

      expect(result).toEqual({
        [component]: {
          [element]: {
            rest: ['shadow__[5,8,3,[10,20,30,0.8]]'],
            focus: ['shadow--focus__[12,16,3,[10,20,30,0.8]]'],
            hover: ['shadow--hover__[5,10,3,[50,60,70,0.9]]']
          }
        }
      });
    });
  });
});
