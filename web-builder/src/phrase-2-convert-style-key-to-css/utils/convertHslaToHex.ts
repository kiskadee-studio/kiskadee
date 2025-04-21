import type { Hex, HLSA } from '@kiskadee/schema';
import { toShortHex } from './toShortHex';

/**
 * Converts an HSLA array into a hexadecimal color string.
 * - h: hue in degrees (0-360)
 * - s and l: saturation and lightness as percentages (0-100)
 * - a: alpha (0-1)
 *
 * Returns a 6-digit hex if alpha is 1, otherwise an 8-digit hex (including alpha).
 * Uses the short version of the hex string when possible.
 */
export function convertHslaToHex(hsla: HLSA): Hex {
  let [h, s, l, a] = hsla;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.padStart(2, '0');
  };

  const rHex = toHex(r);
  const gHex = toHex(g);
  const bHex = toHex(b);

  let result: string;

  // If alpha is 1 or undefined, return a 6-digit hex code.
  if (a == null || a === 1) {
    result = `#${rHex}${gHex}${bHex}`;
    return toShortHex(result);
  }

  const aHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');

  result = `#${rHex}${gHex}${bHex}${aHex}`;
  return toShortHex(result);
}
