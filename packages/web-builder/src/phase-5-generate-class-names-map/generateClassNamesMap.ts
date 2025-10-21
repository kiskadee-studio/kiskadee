import type {
  ComponentName,
  ComponentStyleKeyMap,
  ElementAllSizeValue,
  ElementSizeValue,
  InteractionState,
  SemanticColor
} from '@kiskadee/schema';
import type { ShortenCssClassNames } from '../phase-3-shorten-css-class-names/shortenCssClassNames';

// Shortened keys for optimization (Phase 5 artifact schema):
// d = decorations (always-on, flattened string)
// e = effects by interaction state (arrays of classes, opt-in at component level)
// s = scales (size variants only, flattened strings per size)
// p = palettes (colors, flattened string aggregated per palette)
export type ClassNamesByInteractionState = Partial<Record<string, string[]>>; // legacy for reference
export type ClassNameByElement = {
  // Flattened decorations only (always-on). Effects no longer merge here.
  d?: string;
  // Unified effects base classes string (space-separated). No per-state nesting.
  // Components may append this string unconditionally; activation is controlled by state classes/pseudos in CSS.
  e?: string;
  // Control-state specific (selected) — flattened string of utility classes
  c?: string;
  // Scales aggregated per size as flattened strings (size variants only, not effects)
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

/**
 * Produces two JSON-friendly maps of class names from the aggregated StyleKeys:
 * - core: decorations in `d` (always-on), effects in `e` per interaction state (opt-in),
 *         scales in `s` (size-only variants), no palettes included.
 * - palettes: one object per palette name, each containing only the flattened `p` string per element.
 *
 * Policy notes:
 * - Effects are never merged into `d` or `s` — they must be explicitly added by components from `e`.
 * - This aligns with Phase 4 where effect CSS is only emitted when gated (class activator/pseudo).
 * - Keys are shortened via ShortenCssClassNames map.
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

      // Core (no palettes) — aggregate:
      // - decorations into `d` (always-on),
      // - effects into `e` per interaction state (opt-in),
      // - scales (size variants only) into `s`.
      const dSet = new Set<string>();
      const sMap = new Map<string, Set<string>>();
      // Collect all effects (across interaction states) into a single unified set
      const eSet = new Set<string>();
      // Control-state: selected — collect separately and do not mix into e/p
      const cSelectedSet = new Set<string>();

      // decorations → d
      mapArray(el.decorations, shortenMap)?.forEach((c) => {
        dSet.add(c);
      });

      // effects → e (flatten non-selected states into a single set); never merge effects into d/s
      if (el.effects) {
        for (const st of Object.keys(el.effects)) {
          const arr = (el.effects as any)[st] as string[] | undefined;
          if (!arr || arr.length === 0) continue;
          const isSelectedState = st === 'selected' || st.startsWith('selected:');
          for (const key of arr) {
            const cls = shortenMap[key] ?? key;
            if (isSelectedState) cSelectedSet.add(cls);
            else eSet.add(cls);
          }
        }
      }

      // scales → s[size] (size-only variants)
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
          // Flatten only this palette into a single string, excluding selected-related states
          const pSet = new Set<string>();
          for (const sem of Object.keys(bySemantic)) {
            const byState = bySemantic[sem as SemanticColor];
            for (const st of Object.keys(byState ?? {})) {
              const mapped = mapArray(byState?.[st as InteractionState], shortenMap);
              const isSelectedState = st === 'selected' || st.startsWith('selected:');
              mapped?.forEach((c) => {
                if (isSelectedState) {
                  // Union selected palette classes into control set (core)
                  cSelectedSet.add(c);
                } else {
                  pSet.add(c);
                }
              });
            }
          }
          elemRecord.p = pSet.size > 0 ? Array.from(pSet).join(' ') : undefined;
        }
      }

      // After processing palettes, finalize the core element record so `c` includes palette-derived selected classes
      core[componentName][elementName] = {
        d: dSet.size ? Array.from(dSet).join(' ') : undefined,
        e: eSet.size ? Array.from(eSet).join(' ') : undefined,
        c: cSelectedSet.size ? Array.from(cSelectedSet).join(' ') : undefined,
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
    }
  }

  return { core, palettes };
}
