import type { DecorationSchema } from '@kiskadee/schema';
import { describe, expect, it } from 'vitest';
import { convertElementDecorationToStyleKeys } from './convertElementDecorationToStyleKeys';

describe('convertElementDecorationToStyleKeys', () => {
  describe('textFont style key generation', () => {
    it('should generate the textFont style key for a font family array', () => {
      const decoration: DecorationSchema = { textFont: ['Arial', 'Helvetica'] };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textFont__["Arial","Helvetica"]');
      expect(styleKey).toMatchSnapshot();
    });
  });

  describe('textItalic style key generation', () => {
    it('generates the textItalic__true style key when italic is enabled', () => {
      const decoration: DecorationSchema = { textItalic: true };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textItalic__true');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textItalic__false style key when italic is disabled', () => {
      const decoration: DecorationSchema = { textItalic: false };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textItalic__false');
      expect(styleKey).toMatchSnapshot();
    });
  });

  describe('textWeight style key generation', () => {
    it('generates the textWeight__thin style key for thin font weight', () => {
      const decoration: DecorationSchema = { textWeight: 'thin' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textWeight__thin');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textWeight__extraLight style key for extraLight font weight', () => {
      const decoration: DecorationSchema = { textWeight: 'extraLight' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textWeight__extraLight');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textWeight__light style key for light font weight', () => {
      const decoration: DecorationSchema = { textWeight: 'light' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textWeight__light');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textWeight__normal style key for normal font weight', () => {
      const decoration: DecorationSchema = { textWeight: 'normal' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textWeight__normal');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textWeight__medium style key for medium font weight', () => {
      const decoration: DecorationSchema = { textWeight: 'medium' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textWeight__medium');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textWeight__semiBold style key for semiBold font weight', () => {
      const decoration: DecorationSchema = { textWeight: 'semiBold' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textWeight__semiBold');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textWeight__bold style key for bold font weight', () => {
      const decoration: DecorationSchema = { textWeight: 'bold' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textWeight__bold');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textWeight__extraBold style key for extraBold font weight', () => {
      const decoration: DecorationSchema = { textWeight: 'extraBold' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textWeight__extraBold');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textWeight__black style key for black font weight', () => {
      const decoration: DecorationSchema = { textWeight: 'black' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textWeight__black');
      expect(styleKey).toMatchSnapshot();
    });
  });

  describe('textLineType style key generation', () => {
    it('generates the textLineType__none style key for none line type', () => {
      const decoration: DecorationSchema = { textLineType: 'none' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textLineType__none');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textLineType__underline style key for underline line type', () => {
      const decoration: DecorationSchema = { textLineType: 'underline' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textLineType__underline');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textLineType__lineThrough style key for lineThrough line type', () => {
      const decoration: DecorationSchema = { textLineType: 'lineThrough' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textLineType__lineThrough');
      expect(styleKey).toMatchSnapshot();
    });
  });

  describe('textAlign style key generation', () => {
    it('generates the textAlign__left style key for left text alignment', () => {
      const decoration: DecorationSchema = { textAlign: 'left' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textAlign__left');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textAlign__center style key for center text alignment', () => {
      const decoration: DecorationSchema = { textAlign: 'center' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textAlign__center');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the textAlign__right style key for right text alignment', () => {
      const decoration: DecorationSchema = { textAlign: 'right' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('textAlign__right');
      expect(styleKey).toMatchSnapshot();
    });
  });

  describe('borderStyle style key generation', () => {
    it('generates the borderStyle__none style key for none border style', () => {
      const decoration: DecorationSchema = { borderStyle: 'none' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('borderStyle__none');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the borderStyle__dotted style key for dotted border style', () => {
      const decoration: DecorationSchema = { borderStyle: 'dotted' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('borderStyle__dotted');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the borderStyle__dashed style key for dashed border style', () => {
      const decoration: DecorationSchema = { borderStyle: 'dashed' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('borderStyle__dashed');
      expect(styleKey).toMatchSnapshot();
    });

    it('generates the borderStyle__solid style key for solid border style', () => {
      const decoration: DecorationSchema = { borderStyle: 'solid' };
      const styleKey = convertElementDecorationToStyleKeys(decoration)[0];

      expect(styleKey).toEqual('borderStyle__solid');
      expect(styleKey).toMatchSnapshot();
    });
  });
});
