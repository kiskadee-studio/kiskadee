import { describe, it, expect } from 'vitest';
import { transformTextAlignKeyToCss } from './transformTextAlignKeyToCss';
import { UNSUPPORTED_PROPERTY_NAME, UNSUPPORTED_VALUE } from '../errorMessages';

describe('transformTextAlignKeyToCss function', () => {
  describe('Successful operation', () => {
    it('should return GeneratedCss for "left"', () => {
      const result = transformTextAlignKeyToCss('textAlign__left');
      expect(result).toEqual({
        className: 'textAlign__left',
        cssRule: '.textAlign__left { text-align: left; }'
      });
      expect(result).toMatchSnapshot();
    });

    it('should return GeneratedCss for "center"', () => {
      const result = transformTextAlignKeyToCss('textAlign__center');
      expect(result).toEqual({
        className: 'textAlign__center',
        cssRule: '.textAlign__center { text-align: center; }'
      });
      expect(result).toMatchSnapshot();
    });

    it('should return GeneratedCss for "right"', () => {
      const result = transformTextAlignKeyToCss('textAlign__right');
      expect(result).toEqual({
        className: 'textAlign__right',
        cssRule: '.textAlign__right { text-align: right; }'
      });
      expect(result).toMatchSnapshot();
    });

    it('should return GeneratedCss for "justify"', () => {
      const result = transformTextAlignKeyToCss('textAlign__justify');
      expect(result).toEqual({
        className: 'textAlign__justify',
        cssRule: '.textAlign__justify { text-align: justify; }'
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('Error handling', () => {
    it('should throw an error for unsupported alignment value', () => {
      const call = () => transformTextAlignKeyToCss('textAlign__top');
      expect(call).toThrowError(UNSUPPORTED_VALUE('textAlign', 'top', 'textAlign__top'));
      expect(call).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error for an invalid prefix', () => {
      const call = () => transformTextAlignKeyToCss('alignText__center');
      expect(call).toThrowError(UNSUPPORTED_PROPERTY_NAME('textAlign', 'alignText__center'));
      expect(call).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error for extra separators', () => {
      const call = () => transformTextAlignKeyToCss('textAlign__center__extra');
      expect(call).toThrowError(
        UNSUPPORTED_VALUE('textAlign', 'center__extra', 'textAlign__center__extra')
      );
      expect(call).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error for missing separators', () => {
      const call = () => transformTextAlignKeyToCss('textAlign-center');
      expect(call).toThrowError(UNSUPPORTED_PROPERTY_NAME('textAlign', 'textAlign-center'));
      expect(call).toThrowErrorMatchingSnapshot();
    });
  });
});
