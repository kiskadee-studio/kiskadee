import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
import classNamesMap from '../../../web-builder/build/classNamesMap.json';
import App from './App.tsx';
import { StyleClassesContext } from './contexts/StyleClassesContext';

function Root() {
  const [palette, setPalette] = useState<string>('p1');
  return (
    <StrictMode>
      <BrowserRouter>
        <StyleClassesContext.Provider
          value={{
            classesMap: classNamesMap as ComponentClassNameMapJSON,
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
