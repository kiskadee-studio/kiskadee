import type {
  ComponentName,
  ComponentStyleKeyMap,
  ElementAllSizeValue,
  ElementSizeValue,
  InteractionState,
  SemanticColor,
  StyleKeysByInteractionState
} from '@kiskadee/schema';
import type { ShortenCssClassNames } from '../phase-3-shorten-css-class-names/shortenCssClassNames';

// Shortened keys for optimization:
// d = decorations (incl. effects without size), s = scales (incl. effects with size), p = palettes (colors)
export type ClassNamesByInteractionState = Partial<Record<string, string[]>>;
export type ClassNameByElement = {
  // Flattened decorations + non-size effects
  d?: string;
  // Scales aggregated per size as flattened strings
  s?: Partial<Record<ElementSizeValue | ElementAllSizeValue, string>>;
  // Flattened palettes aggregated into a single space-separated string of class names
  p?: string;
};
export type ComponentClassNameMap = Partial<Record<string, Record<string, ClassNameByElement>>>;

export type ComponentClassNameMapSplit = {
  core: ComponentClassNameMap; // no palettes included
  palettes: Record<string, ComponentClassNameMap>; // each contains only flattened `p` for that palette
};

function mapArray(
  keys: string[] | undefined,
  shortenMap: ShortenCssClassNames
): string[] | undefined {
  if (!keys) return undefined;
  return keys.map((k) => shortenMap[k] ?? k);
}

function mapInteractionState(
  obj: StyleKeysByInteractionState | undefined,
  shortenMap: ShortenCssClassNames
): ClassNamesByInteractionState | undefined {
  if (!obj) return undefined;
  const out: ClassNamesByInteractionState = {};
  for (const st of Object.keys(obj)) {
    out[st] = mapArray(obj[st as InteractionState], shortenMap);
  }
  return out;
}

function extractSizeFromKey(styleKey: string): string | undefined {
  const head = styleKey.split('__')[0] ?? '';
  const plusIdx = head.indexOf('++');
  if (plusIdx === -1) return undefined;
  const after = head.slice(plusIdx + 2);
  // cut at first of '::', '--', '==', '__' if present
  const cuts = [
    after.indexOf('::'),
    after.indexOf('--'),
    after.indexOf('=='),
    after.indexOf('__')
  ].filter((i) => i !== -1) as number[];
  const cut = cuts.length > 0 ? Math.min(...cuts) : -1;
  const seg = cut === -1 ? after : after.slice(0, cut);
  return seg || undefined;
}

/**
 * Produces two JSON-friendly maps of class names from the aggregated StyleKeys:
 * - core: decorations + effects (non-size) in `d`, and scales/effects (size-bound) in `s`.
 * - palettes: one object per palette name, each containing only the flattened `p` string per element.
 *
 * Notes:
 * - Keys are shortened via ShortenCssClassNames map.
 * - Effects with responsive size tokens ("++s:*") are grouped into `s` per size; otherwise they go into `d`.
 */
export function generateClassNamesMapSplit(
  styleKeys: ComponentStyleKeyMap,
  shortenMap: ShortenCssClassNames
): ComponentClassNameMapSplit {
  const core: ComponentClassNameMap = {};
  const palettes: Record<string, ComponentClassNameMap> = {};

  for (const componentName of Object.keys(styleKeys)) {
    const elements = styleKeys[componentName as ComponentName];
    if (!elements) continue;
    core[componentName] = {};
    for (const elementName of Object.keys(elements)) {
      const el = elements[elementName];

      // Core (no palettes) — aggregate decorations + effects (no size) into d, and
      // scales + effects (with size) into s.
      const dSet = new Set<string>();
      const sMap = new Map<string, Set<string>>();

      // decorations → d
      mapArray(el.decorations, shortenMap)?.forEach((c) => {
        dSet.add(c);
      });

      // effects → d (no size) or s[size] (with size)
      if (el.effects) {
        for (const st of Object.keys(el.effects)) {
          const arr = (el.effects as any)[st] as string[] | undefined;
          if (!arr) continue;
          for (const key of arr) {
            const size = extractSizeFromKey(key);
            const cls = shortenMap[key] ?? key;
            if (size) {
              if (!sMap.has(size)) sMap.set(size, new Set());
              sMap.get(size)!.add(cls);
            } else {
              dSet.add(cls);
            }
          }
        }
      }

      // scales → s[size]
      if (el.scales) {
        for (const [size, arr] of Object.entries(el.scales)) {
          const mapped = mapArray(arr, shortenMap);
          if (!mapped || mapped.length === 0) continue;
          if (!sMap.has(size)) sMap.set(size, new Set());
          const set = sMap.get(size)!;
          mapped.forEach((c) => {
            set.add(c);
          });
        }
      }

      core[componentName][elementName] = {
        d: dSet.size ? Array.from(dSet).join(' ') : undefined,
        s:
          sMap.size > 0
            ? Object.fromEntries(
                Array.from(sMap.entries()).map(([k, set]) => [
                  k,
                  set.size ? Array.from(set).join(' ') : undefined
                ])
              )
            : undefined
      };

      // Palettes split per palette name; flatten so that per-palette JSON has only `p` (no paletteName level)
      if (el.palettes) {
        for (const paletteName of Object.keys(el.palettes)) {
          if (!palettes[paletteName]) palettes[paletteName] = {};
          if (!palettes[paletteName][componentName]) {
            palettes[paletteName][componentName] = {};
          }
          const bySemantic = el.palettes[paletteName];
          // ensure element record exists (avoid assignment inside expression per Biome rule)
          if (!palettes[paletteName][componentName][elementName]) {
            palettes[paletteName][componentName][elementName] = {};
          }
          const elemRecord = palettes[paletteName][componentName][elementName];
          // Flatten only this palette into a single string
          const set = new Set<string>();
          for (const sem of Object.keys(bySemantic)) {
            const byState = bySemantic[sem as SemanticColor];
            for (const st of Object.keys(byState ?? {})) {
              const mapped = mapArray(byState?.[st as InteractionState], shortenMap);
              mapped?.forEach((c) => {
                set.add(c);
              });
            }
          }
          elemRecord.p = set.size > 0 ? Array.from(set).join(' ') : undefined;
        }
      }
    }
  }

  return { core, palettes };
}
