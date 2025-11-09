import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import './global.scss';
import type { ComponentClassNameMapJSON, ThemeMode } from '@kiskadee/core';
import App from './App.tsx';
import { KiskadeeContext } from './contexts/KiskadeeContext.tsx';

// Initial transition blocker: disable CSS transitions until the core CSS, palette CSS,
// and any effect-specific CSS are loaded. This avoids jarring animations during the
// first paint while stylesheets are still being swapped.
let __kiskadeeInitialBlockerActive = true;
let __kiskadeeInitialCssPending = 3; // core + palette + effects
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('no-transitions');
}

// Auto-discover available templates using Vite glob imports
// Note: classNames maps and CSS are emitted to web-builder/build
const coreMaps = import.meta.glob('../../../web-builder/build/*/classNamesMap.json', {
  eager: true
}) as Record<string, { default: ComponentClassNameMapJSON } | ComponentClassNameMapJSON>;

// Auto-discover segment.theme palette maps
const paletteMaps = import.meta.glob('../../../web-builder/build/*/classNamesMap.*.json', {
  eager: false // lazy load
}) as Record<string, () => Promise<{ default: ComponentClassNameMapJSON }>>;

// Auto-discover manifests for display labels and metadata
// They may live in packages/build (phase 7) or web-builder/build depending on the builder version.
const manifestMods = {
  ...(import.meta.glob('../../../build/*/manifest.json', { eager: true }) as Record<string, any>),
  ...(import.meta.glob('../../../web-builder/build/*/manifest.json', { eager: true }) as Record<
    string,
    any
  >)
} as Record<string, any>;

function extractTemplateKeyFromPath(p: string): string {
  const m = p.match(/build\/(.*?)\//);
  return m ? m[1] : p;
}

// Build a map: templateKey -> manifest content
const templateMeta: Record<string, any> = {};
for (const p in manifestMods) {
  const key = extractTemplateKeyFromPath(p);
  const mod = manifestMods[p];
  templateMeta[key] = mod?.default ?? mod;
}

// Extract segment.theme from classNamesMap.segment.theme.json
function extractSegmentThemeFromPath(p: string): { segment: string; theme: string } | null {
  const m = p.match(/classNamesMap\.([^.]+)\.([^.]+)\.json$/);
  if (!m) return null;
  return { segment: m[1], theme: m[2] };
}

const templates = (() => {
  const out: Record<
    string,
    {
      core: ComponentClassNameMapJSON;
      availableSegments: Set<string>;
      availableThemes: Map<string, Set<string>>; // segment -> themes
    }
  > = {};

  // Process core maps
  for (const p in coreMaps) {
    const key = extractTemplateKeyFromPath(p);
    const mod = coreMaps[p] as any;
    const core = mod?.default ?? mod;
    if (!out[key]) {
      out[key] = {
        core,
        availableSegments: new Set(),
        availableThemes: new Map()
      };
    } else {
      out[key].core = core;
    }
  }

  // Process palette maps to discover segments and themes
  for (const p in paletteMaps) {
    const templateKey = extractTemplateKeyFromPath(p);
    const segmentTheme = extractSegmentThemeFromPath(p);
    if (!segmentTheme || !out[templateKey]) continue;

    out[templateKey].availableSegments.add(segmentTheme.segment);

    if (!out[templateKey].availableThemes.has(segmentTheme.segment)) {
      out[templateKey].availableThemes.set(segmentTheme.segment, new Set());
    }
    out[templateKey].availableThemes.get(segmentTheme.segment)!.add(segmentTheme.theme);
  }

  return out;
})();

type TemplateKey = keyof typeof templates | string;

function Root() {
  const templateKeys = useMemo(() => Object.keys(templates), []);

  // State: template (design system)
  const [template, setTemplate] = useState<TemplateKey>(() => {
    const saved =
      typeof localStorage !== 'undefined'
        ? (localStorage.getItem('kiskadee.template') as TemplateKey | null)
        : null;
    if (saved && saved in templates) return saved as TemplateKey;
    return (Object.keys(templates)[0] as TemplateKey) || 'ios-26-apple';
  });

  // State: segment (brand/product)
  const [segment, setSegment] = useState<string>(() => {
    const saved =
      typeof localStorage !== 'undefined' ? localStorage.getItem('kiskadee.segment') : null;
    const current = templates[template];
    if (saved && current?.availableSegments.has(saved)) return saved;
    // Default: first available segment
    return Array.from(current?.availableSegments || [])[0] || 'ios';
  });

  // State: theme (light/dark/darker)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved =
      typeof localStorage !== 'undefined'
        ? (localStorage.getItem('kiskadee.theme') as ThemeMode | null)
        : null;
    const current = templates[template];
    const themesForSegment = current?.availableThemes.get(segment);
    if (saved && themesForSegment?.has(saved)) return saved;
    // Default: 'light' if available, otherwise first theme
    if (themesForSegment?.has('light')) return 'light';
    return (Array.from(themesForSegment || [])[0] as ThemeMode) || 'light';
  });

  // When template changes, validate segment and theme
  useEffect(() => {
    const current = templates[template];
    if (!current) return;

    // Validate segment
    if (!current.availableSegments.has(segment)) {
      const firstSegment = Array.from(current.availableSegments)[0];
      if (firstSegment) setSegment(firstSegment);
    }

    // Validate theme
    const themesForSegment = current.availableThemes.get(segment);
    if (!themesForSegment?.has(theme)) {
      const firstTheme = Array.from(themesForSegment || [])[0];
      if (firstTheme) setTheme(firstTheme as ThemeMode);
    }
  }, [template, segment, theme]);

  // When segment changes, validate theme
  useEffect(() => {
    const current = templates[template];
    const themesForSegment = current?.availableThemes.get(segment);
    if (!themesForSegment?.has(theme)) {
      const firstTheme = themesForSegment?.has('light')
        ? 'light'
        : Array.from(themesForSegment || [])[0];
      if (firstTheme) setTheme(firstTheme as ThemeMode);
    }
  }, [segment, template, theme]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kiskadee.template', template);
    } catch {}
  }, [template]);

  useEffect(() => {
    try {
      localStorage.setItem('kiskadee.segment', segment);
    } catch {}
  }, [segment]);

  useEffect(() => {
    try {
      localStorage.setItem('kiskadee.theme', theme);
    } catch {}
  }, [theme]);

  // Load/swap CSS for the selected template (core)
  useEffect(() => {
    const id = 'kiskadee-css';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (__kiskadeeInitialBlockerActive) {
      const onLoad = () => {
        __kiskadeeInitialCssPending -= 1;
        if (__kiskadeeInitialCssPending <= 0) {
          document.documentElement.classList.remove('no-transitions');
          __kiskadeeInitialBlockerActive = false;
        }
      };
      link.addEventListener('load', onLoad, { once: true });
    }
    const href = new URL(
      `../../../web-builder/build/${template}/kiskadee.css`,
      import.meta.url
    ).toString();
    link.href = href;
  }, [template]);

  // Load/swap CSS for the selected segment.theme
  useEffect(() => {
    const id = 'kiskadee-palette-css';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (__kiskadeeInitialBlockerActive) {
      const onLoad = () => {
        __kiskadeeInitialCssPending -= 1;
        if (__kiskadeeInitialCssPending <= 0) {
          document.documentElement.classList.remove('no-transitions');
          __kiskadeeInitialBlockerActive = false;
        }
      };
      link.addEventListener('load', onLoad, { once: true });
    }
    // New format: segment.theme.css (ex: ios.light.css)
    const href = new URL(
      `../../../web-builder/build/${template}/${segment}.${theme}.css`,
      import.meta.url
    ).toString();
    link.href = href;
  }, [template, segment, theme]);

  // Load Effects CSS last (per template)
  useEffect(() => {
    const id = 'kiskadee-effects-css';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (__kiskadeeInitialBlockerActive) {
      const onLoad = () => {
        __kiskadeeInitialCssPending -= 1;
        if (__kiskadeeInitialCssPending <= 0) {
          document.documentElement.classList.remove('no-transitions');
          __kiskadeeInitialBlockerActive = false;
        }
      };
      link.addEventListener('load', onLoad, { once: true });
    }
    const href = new URL(
      `../../../web-builder/build/${template}/effects.css`,
      import.meta.url
    ).toString();
    link.href = href;
  }, [template]);

  // Merge core map with the selected segment.theme palette map loaded dynamically
  const [paletteMap, setPaletteMap] = useState<ComponentClassNameMapJSON | null>(null);

  useEffect(() => {
    let aborted = false;
    // New format: classNamesMap.segment.theme.json (ex: classNamesMap.ios.light.json)
    const url = new URL(
      `../../../web-builder/build/${template}/classNamesMap.${segment}.${theme}.json`,
      import.meta.url
    ).toString();

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Failed to load ${url}`))))
      .then((json) => {
        if (!aborted) setPaletteMap(json as ComponentClassNameMapJSON);
      })
      .catch((err) => {
        console.warn(`Failed to load palette map for ${segment}.${theme}:`, err);
        if (!aborted) setPaletteMap(null);
      });

    return () => {
      aborted = true;
    };
  }, [template, segment, theme]);

  // Merge core map with palette map
  const classesMap = useMemo(() => {
    const current = templates[template as string];
    const fallbackKey = templateKeys[0];
    const core = current?.core || (fallbackKey ? templates[fallbackKey].core : ({} as any));
    if (!paletteMap) return core;

    // Merge: copy core and overlay palettes from paletteMap
    const merged: ComponentClassNameMapJSON = JSON.parse(JSON.stringify(core));
    for (const comp in paletteMap) {
      (merged as any)[comp] = (merged as any)[comp] || {};
      const compEl = (paletteMap as any)[comp];
      for (const el in compEl) {
        (merged as any)[comp][el] = (merged as any)[comp][el] || {};
        const elObj = compEl[el];
        // Merge color classes object (c) from palette JSON
        if (elObj?.c) {
          (merged as any)[comp][el].c = elObj.c;
        }
      }
    }
    return merged;
  }, [template, paletteMap, templateKeys]);

  // Compute available options for current template
  const currentTemplate = templates[template];
  const availableSegments = useMemo(
    () => Array.from(currentTemplate?.availableSegments || []),
    [template]
  );
  const availableThemes = useMemo(
    () => Array.from(currentTemplate?.availableThemes.get(segment) || []),
    [template, segment]
  );

  return (
    <StrictMode>
      <BrowserRouter>
        <KiskadeeContext.Provider
          value={{
            classesMap,
            segment,
            theme,
            setSegment,
            setTheme,
            template: template as string,
            setTemplate: (t: string) => setTemplate(t as TemplateKey),
            availableSegments,
            availableThemes,
            templateKeys,
            templateMeta
          }}
        >
          <App />
        </KiskadeeContext.Provider>
      </BrowserRouter>
    </StrictMode>
  );
}

// biome-ignore lint/style/noNonNullAssertion: root element exists in index.html
createRoot(document.getElementById('root')!).render(<Root />);
