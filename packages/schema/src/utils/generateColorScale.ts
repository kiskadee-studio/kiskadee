import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ColorScale, HSLA } from '../types/colors/colors.types';

/**
 * Converts a hexadecimal color to HSLA format.
 * @param hex - Hexadecimal color string (e.g., "#6750A4" or "6750A4")
 * @param verbose
 * @returns HSLA array [hue, saturation, lightness, alpha]
 */
function hexToHSLA(hex: string, verbose = false): HSLA {
  if (verbose) console.log('[hexToHSLA] input:', hex);
  // Normalize hex: remove # and expand 3-digit to 6-digit
  let cleanHex = hex.trim().replace(/^#/, '').toLowerCase();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleanHex.length !== 6) {
    if (verbose)
      console.warn('[hexToHSLA] Invalid hex length; defaulting to 000000. Input:', cleanHex);
    cleanHex = '000000';
  }
  if (verbose) console.log('[hexToHSLA] cleanHex:', cleanHex);

  // Parse RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  if (verbose) console.log('[hexToHSLA] r,g,b:', r, g, b);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (verbose) console.log('[hexToHSLA] max,min,delta:', max, min, delta);

  // Calculate lightness
  const lightness = (max + min) / 2;
  if (verbose) console.log('[hexToHSLA] lightness:', lightness);

  // Calculate saturation
  let saturation = 0;
  if (delta !== 0) {
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  }
  if (verbose) console.log('[hexToHSLA] saturation:', saturation);

  // Calculate hue
  let hue = 0;
  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      hue = ((b - r) / delta + 2) / 6;
    } else {
      hue = ((r - g) / delta + 4) / 6;
    }
  }
  if (verbose) console.log('[hexToHSLA] hue (0-1):', hue);

  // Convert to degrees and percentages
  const hueInDegrees = Math.round(hue * 360);
  const saturationPercent = Math.round(saturation * 100);
  const lightnessPercent = Math.round(lightness * 100);

  const out: HSLA = [hueInDegrees, saturationPercent, lightnessPercent, 1];
  if (verbose) console.log('[hexToHSLA] result HSLA:', out);

  return out;
}

/**
 * Generates a complete Kiskadee color scale (0-1000) from a hex color.
 * The input color is used as the anchor at tone 500.
 *
 * Scale rules:
 * - Tone 0-100: 100% to 90% lightness (1% decrements, 11 tones total)
 * - Tone 100-500: proportional distribution from 90% to anchor lightness
 * - Tone 500-1000: proportional distribution from anchor to 0% lightness
 *
 * @param hexColor - Hexadecimal color string (e.g., "#6750A4")
 * @param prioritizeLightnessScale - When true, set tone 500 to L=50 regardless of input; when false, keep the input lightness at 500.
 * @returns ColorScale object with tones 0, 10, 20...1000
 *
 * @example
 * const scale = generateColorScale("#6750A4", true);
 * // Returns a ColorScale with tone 500 centered at 50 when the second argument is true.
 */
export function generateColorScale(hexColor: string, prioritizeLightnessScale = false): ColorScale {
  const [hue, saturation, originalAnchorLightness, alpha] = hexToHSLA(hexColor);
  const anchorLightness = prioritizeLightnessScale ? 50 : originalAnchorLightness; // when prioritizing lightness scale, center at 50

  const scale: ColorScale = {};

  // Range 0-100: 100% to 90% lightness (1% decrements)
  for (let tone = 0; tone <= 100; tone += 10) {
    const lightness = 100 - tone / 10;
    scale[tone as keyof ColorScale] = [hue, saturation, lightness, alpha];
  }

  // Range 100-500: distribute from 90% to anchor lightness
  const rangeBeforeAnchor = 90 - anchorLightness;
  const stepsBeforeAnchor = 4; // 200, 300, 400, 500
  const stepSizeBeforeAnchor = rangeBeforeAnchor / stepsBeforeAnchor;

  scale[200] = [hue, saturation, Math.round(90 - stepSizeBeforeAnchor), alpha];
  scale[300] = [hue, saturation, Math.round(90 - stepSizeBeforeAnchor * 2), alpha];
  scale[400] = [hue, saturation, Math.round(90 - stepSizeBeforeAnchor * 3), alpha];
  scale[500] = [hue, saturation, anchorLightness, alpha]; // Anchor (either original or centered at 50)

  // Range 500-1000: distribute from anchor to 0% lightness
  const rangeAfterAnchor = anchorLightness;
  const stepsAfterAnchor = 5; // 600, 700, 800, 900, 1000
  const stepSizeAfterAnchor = rangeAfterAnchor / stepsAfterAnchor;

  scale[600] = [hue, saturation, Math.round(anchorLightness - stepSizeAfterAnchor), alpha];
  scale[700] = [hue, saturation, Math.round(anchorLightness - stepSizeAfterAnchor * 2), alpha];
  scale[800] = [hue, saturation, Math.round(anchorLightness - stepSizeAfterAnchor * 3), alpha];
  scale[900] = [hue, saturation, Math.round(anchorLightness - stepSizeAfterAnchor * 4), alpha];
  scale[1000] = [hue, saturation, 0, alpha];

  return scale;
}

/**
 * Generates a complete Kiskadee color scale and logs it in a format that's easy to copy.
 *
 * @param hexColor - Hexadecimal color string (e.g., "#6750A4")
 * @param prioritizeLightnessScale - When true, ignore the original lightness and center tone 500 at 50.
 *                                   When false (default), keep the input color's original lightness at 500.
 *
 * @example
 * generateColorScaleWithLog("#6750A4", true);
 * // Logs the scale structure and returns the ColorScale object
 */
export function generateColorScaleWithLog(
  hexColor: string,
  prioritizeLightnessScale = false
): ColorScale {
  const scale = generateColorScale(hexColor, prioritizeLightnessScale);

  // Build tone lines once so we can reuse for console and file output
  const toneLines: string[] = [];

  // Add comment for range 0-100
  toneLines.push('  // Range 0-100: 100% to 90% lightness with 1% decrements (11 tones total)');

  for (let tone = 0; tone <= 100; tone += 10) {
    const color = scale[tone as keyof ColorScale];
    if (color) {
      const comment =
        tone === 0
          ? ' // 100% lightness (white/lightest)'
          : tone === 100
            ? ' // 90% lightness (end of 10% range from top)'
            : ` // ${color[2]}% lightness`;
      toneLines.push(`  ${tone}: [${color.join(', ')}],${comment}`);
    }
  }

  // Add comment for range 100-500
  const anchor = scale[500];
  if (anchor?.[2]) {
    toneLines.push(
      `  // Range 100-500: distribute (90% - ${anchor[2]}%) = ${90 - anchor[2]}% across 4 steps`
    );
  }

  for (const tone of [200, 300, 400, 500]) {
    const color = scale[tone as keyof ColorScale];
    if (color) {
      const comment =
        tone === 500
          ? ` // ${color[2]}% lightness - ${hexColor.toUpperCase()} - ANCHOR (unchanged)`
          : ` // ${color[2]}% lightness`;
      toneLines.push(`  ${tone}: [${color.join(', ')}],${comment}`);
    }
  }

  // Add comment for range 500-1000
  if (anchor) {
    toneLines.push(
      `  // Range 500-1000: distribute (${anchor[2]}% - 0%) = ${anchor[2]}% across 5 steps`
    );
  }

  for (const tone of [600, 700, 800, 900, 1000]) {
    const color = scale[tone as keyof ColorScale];
    if (color) {
      const comment =
        tone === 1000 ? ' // 0% lightness (black/darkest)' : ` // ${color[2]}% lightness`;
      toneLines.push(`  ${tone}: [${color.join(', ')}],${comment}`);
    }
  }

  // Prepare object body only (no category key)
  const prettyBodyOnly = ['{', ...toneLines, '}'].join('\n');

  // Console output: clear, copy-paste friendly
  console.log('\n' + '='.repeat(80));
  console.log(`Color Scale (${hexColor})`);
  console.log('='.repeat(80));
  console.log('\n// Copy the structure below and paste inside your palette object:\n');
  console.log(prettyBodyOnly);

  console.log('\n' + '='.repeat(80) + '\n');

  // Write the file "color-tones.ts" next to this script (overwrite on each run)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const outFilePath = join(__dirname, 'color-tones.ts');
  const fileContent = `export default ${prettyBodyOnly}\n`;
  writeFileSync(outFilePath, fileContent, 'utf8');
  console.log(`[generateColorScaleWithLog] Wrote TS to: ${outFilePath}`);

  return scale;
}

generateColorScaleWithLog('#000', true);
