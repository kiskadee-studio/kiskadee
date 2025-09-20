import type { ComponentStyleKeyMap } from '@kiskadee/schema';
import type { ShortenCssClassNames } from '../phase-3-shorten-css-class-names/shortenCssClassNames';

// TODO: review it and remove "any" types

// Shortened keys for optimization:
// d = decorations, e = effects, s = scales, p = palettes (colors)
export type ClassNamesByInteractionState = Partial<Record<string, string[]>>;
export type ClassNameByElement = {
  d?: string[];
  e?: ClassNamesByInteractionState;
  s?: Partial<Record<string, string[]>>;
  // For split palette JSONs, `p` is flattened: semantic -> state -> classes
  // For any non-split full map (if used), `p` may still contain palette names.
  p?: any;
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

function mapInteractionState(obj: any, shortenMap: ShortenCssClassNames): any {
  if (!obj) return obj;
  const out: any = {};
  for (const st in obj) {
    out[st] = mapArray(obj[st], shortenMap);
  }
  return out;
}

function mapPalettesFull(palettes: any, shortenMap: ShortenCssClassNames): any {
  // Helper used only by the non-split generator (if needed).
  if (!palettes) return palettes;
  const out: any = {};
  for (const paletteName in palettes) {
    const bySemantic = palettes[paletteName];
    const mappedSemantic: any = {};
    for (const sem in bySemantic) {
      mappedSemantic[sem] = mapInteractionState(bySemantic[sem], shortenMap);
    }
    out[paletteName] = mappedSemantic;
  }
  return out;
}

export function generateClassNamesMap(
  styleKeys: ComponentStyleKeyMap,
  shortenMap: ShortenCssClassNames
): ComponentClassNameMap {
  const result: ComponentClassNameMap = {};
  for (const componentName in styleKeys) {
    const elements = (styleKeys as any)[componentName];
    (result as any)[componentName] = {};
    for (const elementName in elements) {
      const el = elements[elementName];
      (result as any)[componentName][elementName] = {
        d: mapArray(el.decorations, shortenMap),
        e: mapInteractionState(el.effects, shortenMap),
        s: el.scales
          ? Object.fromEntries(
              Object.entries(el.scales).map(([k, arr]: [string, any]) => [
                k,
                mapArray(arr, shortenMap) ?? []
              ])
            )
          : undefined,
        // keep full palettes structure only for the non-split map (if someone consumes it)
        p: mapPalettesFull(el.palettes, shortenMap)
      };
    }
  }
  return result;
}

export function generateClassNamesMapSplit(
  styleKeys: ComponentStyleKeyMap,
  shortenMap: ShortenCssClassNames
): ComponentClassNameMapSplit {
  const core: ComponentClassNameMap = {};
  const palettes: Record<string, ComponentClassNameMap> = {};

  for (const componentName in styleKeys) {
    const elements = (styleKeys as any)[componentName];
    (core as any)[componentName] = {};
    for (const elementName in elements) {
      const el = elements[elementName];

      // Core (no palettes)
      (core as any)[componentName][elementName] = {
        d: mapArray(el.decorations, shortenMap),
        e: mapInteractionState(el.effects, shortenMap),
        s: el.scales
          ? Object.fromEntries(
              Object.entries(el.scales).map(([k, arr]: [string, any]) => [
                k,
                mapArray(arr, shortenMap) ?? []
              ])
            )
          : undefined
      };

      // Palettes split per palette name; flatten so that per-palette JSON has only `p` (no paletteName level)
      if (el.palettes) {
        for (const paletteName in el.palettes) {
          if (!palettes[paletteName]) palettes[paletteName] = {};
          if (!(palettes as any)[paletteName][componentName]) {
            (palettes as any)[paletteName][componentName] = {};
          }
          const bySemantic = el.palettes[paletteName];
          // ensure element record exists (avoid assignment inside expression per Biome rule)
          if (!(palettes as any)[paletteName][componentName][elementName]) {
            (palettes as any)[paletteName][componentName][elementName] = {};
          }
          const elemRecord = (palettes as any)[paletteName][componentName][elementName] as any;
          (elemRecord as any).p = (() => {
            const mappedSemantic: any = {};
            for (const sem in bySemantic) {
              mappedSemantic[sem] = mapInteractionState(bySemantic[sem], shortenMap);
            }
            return mappedSemantic;
          })();
        }
      }
    }
  }

  return { core, palettes };
}
