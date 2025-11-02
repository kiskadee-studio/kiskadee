import { withAlpha } from './withAlpha';
import type { HSLA } from '../types/colors/colors.types';

export type ModeKeyShort = 'l' | 'd';
export type RoleKey = 'primary' | 'secondary' | 'greenLike' | 'yellowLike' | 'redLike' | 'neutral';

const modeFromShort = (m: ModeKeyShort) => (m === 'l' ? 'light' : 'dark');

function resolveSeriesAndKey(tone: number): { series: 'soft' | 'solid'; key: number } {
  if (tone <= 30) {
    const clamped = Math.max(0, Math.min(30, Math.round(tone)));
    return { series: 'soft', key: clamped };
  }
  const solidKeys = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  const clamped = Math.max(40, Math.min(100, Math.round(tone)));
  let best = solidKeys[0];
  let bestDiff = Math.abs(clamped - best);
  for (const k of solidKeys) {
    const diff = Math.abs(clamped - k);
    if (diff < bestDiff) {
      best = k;
      bestDiff = diff;
    }
  }
  return { series: 'solid', key: best };
}

export function color(
  segment: any,
  mode: ModeKeyShort,
  role: RoleKey,
  tone: number,
  alpha?: number
): HSLA {
  const m = modeFromShort(mode) as 'light' | 'dark';
  const { series, key } = resolveSeriesAndKey(tone);

  const theme = segment?.themes?.[m] as any;
  if (!theme) {
    throw new Error(`Theme not found for provided segment in mode=${m}`);
  }
  const bucket = theme?.[role]?.[series];
  if (!bucket) {
    throw new Error(`Role/series not found: role=${role} series=${series} in mode=${m}`);
  }
  const hsla = bucket[key] as HSLA | undefined;
  if (!hsla) {
    const available = Object.keys(bucket).join(', ');
    throw new Error(`Tone ${key} not available in ${role}.${series}. Available: ${available}`);
  }
  return typeof alpha === 'number' ? (withAlpha(hsla, alpha) as HSLA) : hsla;
}
