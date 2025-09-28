import type {
  ComponentName,
  ComponentStyleKeyMap,
  InteractionState,
  SemanticColor,
  StyleKeysByInteractionState
} from '@kiskadee/schema';
import type { ShortenCssClassNames } from '../phase-3-shorten-css-class-names/shortenCssClassNames';

// Shortened keys for optimization:
// d = decorations, e = effects, s = scales, p = palettes (colors)
export type ClassNamesByInteractionState = Partial<Record<string, string[]>>;
export type ClassNameByElement = {
  d?: string[];
  e?: ClassNamesByInteractionState;
  s?: Partial<Record<string, string[]>>;
  // NEW: Flattened palettes aggregated into a single space-separated string of class names
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

      // Core (no palettes)
      core[componentName][elementName] = {
        d: mapArray(el.decorations, shortenMap),
        e: mapInteractionState(el.effects, shortenMap),
        s: el.scales
          ? Object.fromEntries(
              Object.entries(el.scales).map(([k, arr]: [string, string[] | undefined]) => [
                k,
                mapArray(arr, shortenMap) ?? []
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
