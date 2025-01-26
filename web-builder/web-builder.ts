import type { Appearance } from '@kiskadee/schema';

// Objeto para armazenar a estrutura com contador
const styleKeyValueCount: Record<string, number> = {};

// Função para processar a estrutura de Appearance
function processAppearance(appearance: Appearance) {
  for (const [key, value] of Object.entries(appearance)) {
    if (key === 'shadowColor' && Array.isArray(value)) {
      // Exceção para shadowColor: converte para string no formato CSS-friendly
      const keyValue = `${key}__rgba(${value[0]}, ${value[1]}, ${value[2]}, ${value[3]})`;
      styleKeyValueCount[keyValue] = (styleKeyValueCount[keyValue] || 0) + 1;
    } else if (
      typeof value === 'boolean' ||
      typeof value === 'string' ||
      typeof value === 'number'
    ) {
      // Caso seja uma propriedade simples (ex.: fontItalic, fontWeight)
      const keyValue = `${key}__${value}`;
      styleKeyValueCount[keyValue] = (styleKeyValueCount[keyValue] || 0) + 1;
    } else if (typeof value === 'object' && value !== null) {
      // Caso seja um objeto (ex.: shadowBlur, shadowX, shadowY)
      for (const [state, stateValue] of Object.entries(value)) {
        const prefixedKey =
          state === 'rest' // Remove o prefixo 'rest' (estado padrão)
            ? `${key}__${stateValue}`
            : `${key}::${state}__${stateValue}`;
        if (typeof stateValue === 'number') {
          styleKeyValueCount[prefixedKey] = (styleKeyValueCount[prefixedKey] || 0) + 1;
        }
      }
    }
  }
}

// Exemplo de uso com o objeto `buttonAppearance`
const buttonAppearance: Appearance = {
  fontItalic: false,
  fontWeight: 'bold',
  textDecoration: 'none',
  textTransform: 'uppercase',
  textAlign: 'center',
  cursor: 'pointer',
  borderStyle: 'solid',
  shadowColor: [0, 0, 0, 0.5], // Exceção será tratada aqui
  shadowBlur: { rest: 5, hover: 10 },
  shadowY: { rest: 2, hover: 4 },
  shadowX: { rest: 2, hover: 4 }
};

// Processando o objeto Appearance várias vezes para simular repetições
processAppearance(buttonAppearance);
processAppearance(buttonAppearance); // Repetido para testar o contador
processAppearance({
  ...buttonAppearance,
  fontItalic: true // Uma variação para testar uma nova entrada
});

// Mostrando a estrutura final
console.log(styleKeyValueCount);
