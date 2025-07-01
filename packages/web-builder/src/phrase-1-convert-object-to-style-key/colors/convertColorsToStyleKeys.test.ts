import type { ColorSchema, ComponentName, ElementName } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { convertColorsToStyleKeys } from './convertColorsToStyleKeys';

describe('convertColorsToStyleKeys', () => {
  const componentName: ComponentName = 'button';
  const elementName: ElementName = 'e1';

  it('should process a palette property without ref', () => {
    const palettes: ColorSchema = {
      boxColor: {
        primary: {
          rest: [45, 100, 50, 1]
        }
      }
    };

    const result = convertColorsToStyleKeys(componentName, elementName, palettes);

    expect(result).toEqual({
      [componentName]: {
        [elementName]: {
          rest: ['boxColor__[45,100,50,1]']
        }
      }
    });
  });

  it('should process a palette property with a ref value', () => {
    const palettes: ColorSchema = {
      borderColor: {
        primary: {
          rest: [255, 255, 255, 1],
          hover: { ref: [255, 255, 255, 0.1] }
        }
      }
    };

    const result = convertColorsToStyleKeys(componentName, elementName, palettes);

    expect(result).toEqual({
      [componentName]: {
        [elementName]: {
          rest: ['borderColor__[255,255,255,1]'],
          hover: ['borderColor--hover::ref__[255,255,255,0.1]']
        }
      }
    });
  });

  it('should process multiple palette entries', () => {
    const palettes: ColorSchema = {
      textColor: {
        primary: {
          rest: [120, 50, 50, 1],
          hover: { ref: [240, 50, 50, 0.5] }
        },
        secondary: {
          rest: [240, 50, 50, 0.5]
        }
      },
      borderColor: {
        danger: {
          rest: [0, 0, 0, 0.02],
          focus: { ref: [10, 20, 30, 0.1] }
        }
      }
    };

    const result = convertColorsToStyleKeys(componentName, elementName, palettes);

    expect(result).toEqual({
      [componentName]: {
        [elementName]: {
          rest: [
            'textColor__[120,50,50,1]',
            'textColor__[240,50,50,0.5]',
            'borderColor__[0,0,0,0.02]'
          ],
          hover: ['textColor--hover::ref__[240,50,50,0.5]'],
          focus: ['borderColor--focus::ref__[10,20,30,0.1]']
        }
      }
    });
  });
});
