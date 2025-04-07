import { describe, expect, it } from 'vitest';
import { transformTextItalicKeyToCss } from './transformTextItalicKeyToCss';
import { INVALID_KEY_PREFIX, UNSUPPORTED_VALUE } from '../errorMessages';

describe('transformTextItalicKeyToCss function', () => {
  describe('Successful operation', () => {
    // Teste para o valor "true" (italic
    it('should generate the correct CSS rule for "true" (italic)', () => {
      const italicValue = 'true';
      const key = `textItalic__${italicValue}`;
      const result = transformTextItalicKeyToCss(key);
      const expectedCss = `.${key} { font-style: italic; }`;

      expect(result).toBe(expectedCss);
    });

    it('should generate the correct CSS rule for "false" (normal)', () => {
      const italicValue = 'false';
      const key = `textItalic__${italicValue}`;
      const result = transformTextItalicKeyToCss(key);
      const expectedCss = `.${key} { font-style: normal; }`;

      expect(result).toBe(expectedCss);
    });
  });

  describe('Error handling', () => {
    it('should throw an error for keys that do not start with "textItalic__"', () => {
      const invalidPrefix = 'notTextItalic';
      const key = `${invalidPrefix}__true`;
      const expectedMessage = INVALID_KEY_PREFIX('textItalic__', key);
      const result = () => transformTextItalicKeyToCss(key);

      expect(result).toThrowError(expectedMessage);
    });

    it('should throw an error for keys that are not correctly separated', () => {
      const key = 'textItalictrue';
      const expectedMessage = INVALID_KEY_PREFIX('textItalic__', key);
      expect(() => transformTextItalicKeyToCss(key)).toThrowError(expectedMessage);
    });

    // Erro para valor não suportado (por exemplo, "center")
    it('should throw an error for unsupported values', () => {
      const key = 'textItalic__center';
      const expectedMessage = UNSUPPORTED_VALUE('textItalic', 'center', key);
      expect(() => transformTextItalicKeyToCss(key)).toThrowError(expectedMessage);
    });

    // Erro para chave com segmentos extras
    it('should throw an error for keys with extra segments', () => {
      const key = 'textItalic__true__extra';
      const expectedMessage = UNSUPPORTED_VALUE('textItalic', 'true__extra', key);
      expect(() => transformTextItalicKeyToCss(key)).toThrowError(expectedMessage);
    });

    // Erro para chave com segmento de valor vazio
    it('should throw an error for keys with empty value segment', () => {
      const key = 'textItalic__';
      const expectedMessage = UNSUPPORTED_VALUE('textItalic', '', key);
      expect(() => transformTextItalicKeyToCss(key)).toThrowError(expectedMessage);
    });

    // Erro para chave vazia
    it('should throw an error for an empty string', () => {
      const key = '';
      const expectedMessage = INVALID_KEY_PREFIX('textItalic__', key);
      expect(() => transformTextItalicKeyToCss(key)).toThrowError(expectedMessage);
    });
  });
});
