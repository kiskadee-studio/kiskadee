import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ColorScale } from '../types/colors/colors.types';
import { generateColorScale, generateColorScaleWithLog } from './generateColorScale';

// Simple CLI for generating and logging a color scale
// Usage examples:
//   npx tsx src/utils/testColorScale.ts --hex #6750A4 --name primary
//   npx tsx src/utils/testColorScale.ts --hex #6750A4 --name primary --free

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}

const args = parseArgs(process.argv);
const hex = (args.hex as string) || '#6750A4';
const name = (args.name as string) || 'primary';
const prioritizeLightnessScale = Boolean(args.free); // --free = prioritize lightness scale (anchor at 50)

// Resolve script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Output files live next to this script
const outFileTs = join(__dirname, `${name}.ts`);

console.log(`Generating color scale for ${name} from ${hex} ...`);
console.log(`Will write TS file to: ${outFileTs}`);

// Print nicely to console
generateColorScaleWithLog(hex, prioritizeLightnessScale);

// Also write a TS file next to this script with export default { ... }
const scale: ColorScale = generateColorScale(hex, prioritizeLightnessScale);
const toneLines: string[] = [];
// Range 0-100
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
// 100-500
const anchor = scale[500];
if (anchor?.[2]) {
  toneLines.push(
    `  // Range 100-500: distribute (90% - ${anchor[2]}%) = ${90 - anchor[2]}% across 4 steps`
  );
}
for (const tone of [200, 300, 400, 500] as const) {
  const color = scale[tone];
  if (color) {
    const comment =
      tone === 500
        ? ` // ${color[2]}% lightness - ${hex.toUpperCase()} - ANCHOR (unchanged)`
        : ` // ${color[2]}% lightness`;
    toneLines.push(`  ${tone}: [${color.join(', ')}],${comment}`);
  }
}
// 500-1000
if (anchor) {
  toneLines.push(
    `  // Range 500-1000: distribute (${anchor[2]}% - 0%) = ${anchor[2]}% across 5 steps`
  );
}
for (const tone of [600, 700, 800, 900, 1000] as const) {
  const color = scale[tone];
  if (color) {
    const comment =
      tone === 1000 ? ' // 0% lightness (black/darkest)' : ` // ${color[2]}% lightness`;
    toneLines.push(`  ${tone}: [${color.join(', ')}],${comment}`);
  }
}
const prettyBodyOnly = ['{', ...toneLines, '}'].join('\n');
const fileContent = `export default ${prettyBodyOnly}\n`;
writeFileSync(outFileTs, fileContent, 'utf8');
console.log(`[testColorScale] Wrote TS to ${outFileTs}`);
