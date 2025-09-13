import type { ComponentStyleKeyMap } from '@kiskadee/schema';
import type { ShortenCssClassNames } from '../phase-3-shorten-css-class-names/shortenCssClassNames';

export type ClassNamesByInteractionState = Partial<Record<string, string[]>>;
export type ClassNameByElement = {
  decorations?: string[];
  effects?: ClassNamesByInteractionState;
  scales?: Partial<Record<string, string[]>>;
  palettes?: Record<string, Partial<Record<string, ClassNamesByInteractionState>>>;
};
export type ComponentClassNameMap = Partial<Record<string, Record<string, ClassNameByElement>>>;

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

function mapPalettes(palettes: any, shortenMap: ShortenCssClassNames): any {
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
        decorations: mapArray(el.decorations, shortenMap),
        effects: mapInteractionState(el.effects, shortenMap),
        scales: el.scales
          ? Object.fromEntries(
              Object.entries(el.scales).map(([k, arr]: [string, any]) => [
                k,
                mapArray(arr, shortenMap) ?? []
              ])
            )
          : undefined,
        palettes: mapPalettes(el.palettes, shortenMap)
      };
    }
  }
  return result;
}
