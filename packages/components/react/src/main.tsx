import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
// TODO: increase therms
// TODO: increase dynamic imports
import classNamesMaterialCore from '../../../web-builder/build/material-design/classNamesMap.json';
// Import core JSON maps for the three templates (without palettes)
import classNamesTemplate1Core from '../../../web-builder/build/template-1/classNamesMap.json';
import classNamesTemplate2Core from '../../../web-builder/build/template-2/classNamesMap.json';
import App from './App.tsx';
import { KiskadeeContext } from './contexts/KiskadeeContext.tsx';

// Compute CSS URLs for the three templates without injecting them automatically
const cssUrlTemplate1 = new URL(
  '../../../web-builder/build/template-1/kiskadee.css',
  import.meta.url
).toString();
const cssUrlTemplate2 = new URL(
  '../../../web-builder/build/template-2/kiskadee.css',
  import.meta.url
).toString();
const cssUrlMaterial = new URL(
  '../../../web-builder/build/material-design/kiskadee.css',
  import.meta.url
).toString();

type TemplateKey = 'template-1' | 'template-2' | 'material-design';

const templates: Record<TemplateKey, { core: ComponentClassNameMapJSON; cssUrl: string }> = {
  'template-1': {
    core: classNamesTemplate1Core as ComponentClassNameMapJSON,
    cssUrl: cssUrlTemplate1
  },
  'template-2': {
    core: classNamesTemplate2Core as ComponentClassNameMapJSON,
    cssUrl: cssUrlTemplate2
  },
  'material-design': {
    core: classNamesMaterialCore as ComponentClassNameMapJSON,
    cssUrl: cssUrlMaterial
  }
};

function Root() {
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
    return 'template-2';
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
    link.href = templates[template].cssUrl;
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
    const href = new URL(
      `../../../web-builder/build/${template}/${palette}.css`,
      import.meta.url
    ).toString();
    link.href = href;
  }, [template, palette]);

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
    const core = templates[template].core;
    if (!paletteMap) return core;

    // Merge: copy core and overlay palettes from paletteMap
    const merged: ComponentClassNameMapJSON = JSON.parse(JSON.stringify(core));
    for (const comp in paletteMap) {
      (merged as any)[comp] = (merged as any)[comp] || {};
      const compEl = (paletteMap as any)[comp];
      for (const el in compEl) {
        (merged as any)[comp][el] = (merged as any)[comp][el] || {};
        const elObj = compEl[el];
        if (elObj && elObj.p) {
          (merged as any)[comp][el].p = {
            ...((merged as any)[comp][el].p || {}),
            ...elObj.p
          };
        }
      }
    }
    return merged;
  }, [template, paletteMap]);

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
            <option value="template-1">template-1</option>
            <option value="template-2">template-2</option>
            <option value="material-design">material design</option>
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
