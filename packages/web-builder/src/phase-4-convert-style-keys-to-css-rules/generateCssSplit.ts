import type {
  ComponentName,
  ComponentStyleKeyMap,
  ElementAllSizeValue,
  ElementSizeValue,
  InteractionState,
  SemanticColor
} from '@kiskadee/schema';
import postcss from 'postcss';
import combineMq from 'postcss-combine-media-query';
import type { ShortenCssClassNames } from '../phase-3-shorten-css-class-names/shortenCssClassNames';
import { generateCssRuleFromStyleKey } from './generateCss';
import { transformColorKeyToCss } from './palettes/transformColorKeyToCss';

export type SplitCssBundles = {
  coreCss: string;
  effectsCss: string; // new: effects separated from core
  palettes: Record<string, string>;
};

export async function generateCssSplit(
  styleKeys: ComponentStyleKeyMap,
  shortenMap: ShortenCssClassNames,
  forceState?: boolean
): Promise<SplitCssBundles> {
  const coreRules: Set<string> = new Set();
  const effectsRules: Set<string> = new Set(); // collect effects separately
  const paletteRules: Record<string, Set<string>> = {};

  // Helper: detect if a CSS rule uses complex selectors (pseudo-classes or forced state classes)
  const isComplexSelector = (rule: string): boolean => {
    // Check for native pseudo-classes (:hover, :focus, :focus-visible, :focus-within, :active, :disabled, :read-only)
    if (/:(hover|focus|focus-visible|focus-within|active|disabled|read-only)\b/.test(rule))
      return true;

    // Check for forced state class patterns (.-a, .-h, .-f, .-p, .-s, .-d, .-r)
    // These appear as chained classes: .someClass.-h.-a, .-a.-h .someClass, etc.
    return /\.-[a-z]\b/.test(rule);
  };

  // Walk through all style keys by component/element to preserve palette grouping
  for (const componentName in styleKeys) {
    const elements = styleKeys[componentName as ComponentName];
    for (const elementName in elements) {
      const el = elements[elementName];

      // decorations: string[]
      if (Array.isArray(el.decorations)) {
        for (const key of el.decorations) {
          const cn = shortenMap[key] ?? key;
          const rule = generateCssRuleFromStyleKey(key, cn, forceState);
          if (rule && rule.trim() !== '') coreRules.add(rule);
        }
      }

      // scales: Record<string, string[]>
      if (el.scales) {
        for (const scaleKey in el.scales) {
          const arr: string[] = el.scales[scaleKey as ElementSizeValue | ElementAllSizeValue] ?? [];
          for (const key of arr) {
            const cn = shortenMap[key] ?? key;
            const rule = generateCssRuleFromStyleKey(key, cn, forceState);
            if (rule && rule.trim() !== '') coreRules.add(rule);
          }
        }
      }

      // effects: by interaction state -> string[]
      // Route effects based on selector complexity: simple selectors go to core, complex to effects
      if (el.effects) {
        for (const st in el.effects) {
          const arr: string[] = el.effects[st as InteractionState] ?? [];
          for (const key of arr) {
            const cn = shortenMap[key] ?? key;
            const rule = generateCssRuleFromStyleKey(key, cn, forceState);
            if (rule && rule.trim() !== '') {
              // Route based on selector complexity
              if (isComplexSelector(rule)) {
                effectsRules.add(rule); // → effects.css
              } else {
                coreRules.add(rule); // → kiskadee.css
              }
            }
          }
        }
      }

      // palettes: paletteName -> semantic -> interactionState -> string[] (color keys only)
      if (el.palettes) {
        for (const paletteName in el.palettes) {
          const bySemantic = el.palettes[paletteName];
          if (!paletteRules[paletteName]) paletteRules[paletteName] = new Set();
          for (const sem in bySemantic) {
            const byState = bySemantic[sem as SemanticColor];
            for (const st in byState) {
              const arr: string[] = byState[st as InteractionState] ?? [];
              for (const key of arr) {
                const cn = shortenMap[key] ?? key;
                // Only color keys are expected here; call color transformer directly and pass the forceState flag
                const rule = transformColorKeyToCss(key, cn, forceState);
                if (rule && rule.trim() !== '') paletteRules[paletteName].add(rule);
              }
            }
          }
        }
      }
    }
  }

  // Build strings, sort for stability, and post-process media queries per bundle
  const coreRaw = Array.from(coreRules).sort().join('\n');
  const coreOut = await postcss([combineMq()]).process(coreRaw, { from: undefined });

  // Custom order for effects: ensure native pseudo rules (e.g., :hover, :focus, :active)
  // appear AFTER forced-only class rules (e.g., .-s.-a) to win ties in specificity by cascade.
  const weight = (rule: string): number => {
    // Look for native interaction pseudos anywhere in the rule (works with @media wrappers too)
    const hasNative = /:(hover|focus|active)\b/.test(rule);
    return hasNative ? 2 : 0; // higher weight → later in sort
  };
  const effectsRaw = Array.from(effectsRules)
    .sort((a, b) => {
      const wa = weight(a);
      const wb = weight(b);
      if (wa !== wb) return wa - wb; // ascending: non-native first, native last
      return a.localeCompare(b);
    })
    .join('\n');
  const effectsOut = await postcss([combineMq()]).process(effectsRaw, { from: undefined });

  const palettes: Record<string, string> = {};
  for (const p in paletteRules) {
    const raw = Array.from(paletteRules[p])
      .sort((a, b) => {
        const wa = weight(a);
        const wb = weight(b);
        if (wa !== wb) return wa - wb; // non-native first, native last
        return a.localeCompare(b);
      })
      .join('\n');
    const out = await postcss([combineMq()]).process(raw, { from: undefined });
    palettes[p] = out.css;
  }

  return { coreCss: coreOut.css, effectsCss: effectsOut.css, palettes };
}
