import type { HSLA } from '../types/colors/colors.types';

/**
 * Aplica visibilidade (opacidade) a uma cor HSLA.
 *
 * Este helper foi projetado para uso amigável por designers:
 * usa escala 0-100 (porcentagem) ao invés do padrão HSLA 0-1.
 * A conversão para o formato HSLA interno é feita automaticamente.
 *
 * @param color - Cor no formato HSLA [hue, saturation, lightness, alpha]
 * @param visibility - Porcentagem de visibilidade de 0 (invisível) a 100 (totalmente visível)
 * @returns Nova cor HSLA com alpha modificado
 *
 * @example
 * ```typescript
 * // Apple: "disabled usa primary 500 com 20% de opacidade"
 * const disabled = withAlpha(palette.p1.primary.solid[50]!, 20);
 * // Resultado: [206, 100, 50, 0.2]
 *
 * // Sombra com 28% de visibilidade
 * const shadow = withAlpha([0, 0, 0, 1], 28);
 * // Resultado: [0, 0, 0, 0.28]
 *
 * // Cor totalmente visível
 * // Cor totalmente visível
 * const opaque = withAlpha(color, 100);
 * // Resultado: [..., 1]
 *
 * // Cor invisível
 * const transparent = withAlpha(color, 0);
 * // Resultado: [..., 0]
 * ```
 */
export function withAlpha(color: HSLA, visibility: number): HSLA {
  const [h, s, l] = color;

  // Clamp entre 0-100 para garantir valores válidos
  const clampedVisibility = Math.max(0, Math.min(100, visibility));

  // Converte porcentagem (0-100) para alpha HSLA (0-1)
  const alpha = clampedVisibility / 100;

  return [h, s, l, alpha];
}
