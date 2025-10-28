import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import './global.scss';
import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
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

// Auto-discover available templates from web-builder/build using Vite glob imports
const coreMaps = import.meta.glob('../../../web-builder/build/*/classNamesMap.json', {
  eager: true
}) as Record<string, { default: ComponentClassNameMapJSON } | ComponentClassNameMapJSON>;

function extractTemplateKeyFromPath(p: string): string {
  const m = p.match(/build\/(.*?)\//);
  return m ? m[1] : p;
}

const templates = (() => {
  const out: Record<string, { core: ComponentClassNameMapJSON; cssUrl: string }> = {};

  for (const p in coreMaps) {
    const key = extractTemplateKeyFromPath(p);
    const mod = coreMaps[p] as any;
    const core = mod?.default ?? mod;
    if (!out[key]) out[key] = { core, cssUrl: '' } as any;
    else out[key].core = core;
  }

  return out;
})();

type TemplateKey = keyof typeof templates | string;

function Root() {
  const templateKeys = useMemo(() => Object.keys(templates), []);

  const [palette, setPalette] = useState<string>(() => {
    const saved =
      typeof localStorage !== 'undefined' ? localStorage.getItem('kiskadee.palette') : null;
    return saved || 'p1';
  });
  const [template, setTemplate] = useState<TemplateKey>(() => {
    const saved =
      typeof localStorage !== 'undefined'
        ? (localStorage.getItem('kiskadee.template') as TemplateKey | null)
        : null;
    if (saved && saved in templates) return saved as TemplateKey;
    if ('material-design' in templates) return 'material-design';
    return (Object.keys(templates)[0] as TemplateKey) || '';
  });

  // Load/swap CSS for the selected template
  useEffect(() => {
    // TODO: increase id name
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

  // Load/swap CSS for the selected palette (per template)
  useEffect(() => {
    // TODO: increase id name
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
    const href = new URL(
      `../../../web-builder/build/${template}/${palette}.css`,
      import.meta.url
    ).toString();
    link.href = href;
  }, [template, palette]);

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

  // Persist the selected template to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kiskadee.template', template);
    } catch {}
  }, [template]);

  // Persist the selected palette to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kiskadee.palette', palette);
    } catch {}
  }, [palette]);

  // Merge core map with the selected palette map loaded dynamically
  const [paletteMap, setPaletteMap] = useState<ComponentClassNameMapJSON | null>(null);

  useEffect(() => {
    let aborted = false;
    const url = new URL(
      `../../../web-builder/build/${template}/classNamesMap.${palette}.json`,
      import.meta.url
    ).toString();
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Failed to load ${url}`))))
      .then((json) => {
        if (!aborted) setPaletteMap(json as ComponentClassNameMapJSON);
      })
      .catch(() => {
        if (!aborted) setPaletteMap(null);
      });
    return () => {
      aborted = true;
    };
  }, [template, palette]);

  // TODO: remove any
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
        if (elObj && elObj.c) {
          (merged as any)[comp][el].c = elObj.c;
        }
      }
    }
    return merged;
  }, [template, paletteMap, templateKeys[0]]);

  return (
    <StrictMode>
      {/* Template selector */}
      <div style={{ padding: 12 }}>
        <label>
          Template:
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as TemplateKey)}
            style={{ marginLeft: 8 }}
          >
            {templateKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
      </div>
      <BrowserRouter>
        <KiskadeeContext.Provider
          value={{
            classesMap,
            palette,
            setPalette
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
