import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
import classNamesMaterial from '../../../web-builder/build/material-design/classNamesMap.json';
// Import JSON maps for the three templates
import classNamesTemplate1 from '../../../web-builder/build/template-1/classNamesMap.json';
import classNamesTemplate2 from '../../../web-builder/build/template-2/classNamesMap.json';
import App from './App.tsx';
import { StyleClassesContext } from './contexts/StyleClassesContext';

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

const templates: Record<TemplateKey, { map: ComponentClassNameMapJSON; cssUrl: string }> = {
  'template-1': { map: classNamesTemplate1 as ComponentClassNameMapJSON, cssUrl: cssUrlTemplate1 },
  'template-2': { map: classNamesTemplate2 as ComponentClassNameMapJSON, cssUrl: cssUrlTemplate2 },
  'material-design': {
    map: classNamesMaterial as ComponentClassNameMapJSON,
    cssUrl: cssUrlMaterial
  }
};

function Root() {
  const [palette, setPalette] = useState<string>('p1');
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

  // Persist the selected template to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kiskadee.template', template);
    } catch {}
  }, [template]);

  const classesMap = useMemo(() => templates[template].map, [template]);

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
        <StyleClassesContext.Provider
          value={{
            classesMap,
            palette,
            setPalette
          }}
        >
          <App />
        </StyleClassesContext.Provider>
      </BrowserRouter>
    </StrictMode>
  );
}

// biome-ignore lint/style/noNonNullAssertion: root element exists in index.html
createRoot(document.getElementById('root')!).render(<Root />);
