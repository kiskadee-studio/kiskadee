import type { HSLA } from '../types/colors/colors.types';

/**
 * Applies visibility (opacity) to an HSLA color.
 *
 * This helper was designed for designer-friendly usage:
 * uses 0-100 scale (percentage) instead of the standard HSLA 0-1.
 * The conversion to the internal HSLA format is done automatically.
 *
 * @param color - Color in HSLA format [hue, saturation, lightness, alpha]. Returns undefined if undefined.
 * @param visibility - Visibility percentage from 0 (invisible) to 100 (fully visible)
 * @returns New HSLA color with modified alpha, or empty string if color is undefined
 *
 * @example
 * ```TypeScript
 * // Apple: "disabled uses primary 500 with 20% opacity"
 * const disabled = withAlpha(palette.p1.primary.solid[50]!, 20);
 * // Result: [206, 100, 50, 0.2]
 *
 * // Shadow with 28% visibility
 * const shadow = withAlpha([0, 0, 0, 1], 28);
 * // Result: [0, 0, 0, 0.28]
 *
 * // Fully visible color
 * const opaque = withAlpha(color, 100);
 * // Result: [..., 1]
 *
 * // Invisible color
 * const transparent = withAlpha(color, 0);
 * // Result: [..., 0]
 *
 * // Undefined color
 * const empty = withAlpha(undefined, 50);
 * // Result: undefined
 * ```
 */
export function withAlpha(color: HSLA | undefined, visibility: number): HSLA | undefined {
  // Return undefined if the color is undefined
  if (color === undefined) {
    return undefined;
  }

  const [h, s, l] = color;

  // Clamp between 0-100 to ensure valid values
  const clampedVisibility = Math.max(0, Math.min(100, visibility));

  // Convert percentage (0-100) to HSLA alpha (0-1)
  const alpha = clampedVisibility / 100;

  return [h, s, l, alpha];
}
