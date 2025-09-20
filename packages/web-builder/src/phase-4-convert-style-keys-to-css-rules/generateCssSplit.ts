import type { ComponentStyleKeyMap } from '@kiskadee/schema';
import postcss from 'postcss';
import combineMq from 'postcss-combine-media-query';
import type { ShortenCssClassNames } from '../phase-3-shorten-css-class-names/shortenCssClassNames';
import { generateCssRuleFromStyleKey } from './generateCss';
import { transformColorKeyToCss } from './palettes/transformColorKeyToCss';

export type SplitCssBundles = {
  coreCss: string;
  palettes: Record<string, string>;
};

function addRule(rules: string[], rule: string | undefined) {
  if (rule && rule.trim() !== '') rules.push(rule);
}

export async function generateCssSplit(
  styleKeys: ComponentStyleKeyMap,
  shortenMap: ShortenCssClassNames
): Promise<SplitCssBundles> {
  const coreRules: string[] = [];
  const paletteRules: Record<string, string[]> = {};

  // Walk through all style keys by component/element to preserve palette grouping
  for (const componentName in styleKeys) {
    const elements = (styleKeys as any)[componentName];
    for (const elementName in elements) {
      const el = elements[elementName] as any;

      // decorations: string[]
      if (Array.isArray(el.decorations)) {
        for (const key of el.decorations) {
          const cn = shortenMap[key] ?? key;
          addRule(coreRules, generateCssRuleFromStyleKey(key, cn));
        }
      }

      // scales: Record<string, string[]>
      if (el.scales) {
        for (const scaleKey in el.scales) {
          const arr: string[] = el.scales[scaleKey] ?? [];
          for (const key of arr) {
            const cn = shortenMap[key] ?? key;
            addRule(coreRules, generateCssRuleFromStyleKey(key, cn));
          }
        }
      }

      // effects: by interaction state -> string[]
      if (el.effects) {
        for (const st in el.effects) {
          const arr: string[] = el.effects[st] ?? [];
          for (const key of arr) {
            const cn = shortenMap[key] ?? key;
            addRule(coreRules, generateCssRuleFromStyleKey(key, cn));
          }
        }
      }

      // palettes: paletteName -> semantic -> interactionState -> string[] (color keys only)
      if (el.palettes) {
        for (const paletteName in el.palettes) {
          const bySemantic = el.palettes[paletteName];
          if (!paletteRules[paletteName]) paletteRules[paletteName] = [];
          for (const sem in bySemantic) {
            const byState = bySemantic[sem];
            for (const st in byState) {
              const arr: string[] = byState[st] ?? [];
              for (const key of arr) {
                const cn = shortenMap[key] ?? key;
                // Only color keys are expected here; call color transformer directly with forceState=true
                addRule(paletteRules[paletteName], transformColorKeyToCss(key as any, cn, true));
              }
            }
          }
        }
      }
    }
  }

  // Build strings, sort for stability, and post-process media queries per bundle
  const coreRaw = coreRules.sort().join('\n');
  const coreOut = await postcss([combineMq()]).process(coreRaw, { from: undefined });

  const palettes: Record<string, string> = {};
  for (const p in paletteRules) {
    const raw = paletteRules[p].sort().join('\n');
    const out = await postcss([combineMq()]).process(raw, { from: undefined });
    palettes[p] = out.css;
  }

  return { coreCss: coreOut.css, palettes };
}
