import { describe, it, expect } from 'vitest';
import { transformTextWeightKeyToCss } from './transformTextWeightKeyToCss';

describe('transformTextWeightKeyToCss', () => {
  it('deve converter "textWeight__bold" corretamente', () => {
    const result = transformTextWeightKeyToCss('textWeight__bold');
    expect(result).toBe('.textWeight__bold { font-weight: 700 }');
  });

  it('deve converter "textWeight__normal" corretamente', () => {
    const result = transformTextWeightKeyToCss('textWeight__normal');
    expect(result).toBe('.textWeight__normal { font-weight: 400 }');
  });

  it('deve converter "textWeight__light" corretamente', () => {
    const result = transformTextWeightKeyToCss('textWeight__light');
    expect(result).toBe('.textWeight__light { font-weight: 300 }');
  });

  it('deve lançar erro se a key não inicia com "textWeight__"', () => {
    expect(() => transformTextWeightKeyToCss('invalidPrefix__bold')).toThrow(
      'Invalid format. Expected the key (key: invalidPrefix__bold) to start with "textWeight__".'
    );
  });

  it('deve lançar erro se o valor de peso não for suportado', () => {
    expect(() => transformTextWeightKeyToCss('textWeight__unknown')).toThrow(
      'Unsupported text weight: unknown (key: textWeight__unknown).'
    );
  });
});
