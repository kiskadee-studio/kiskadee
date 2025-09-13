import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
import classNamesMap from '../../../web-builder/build/classNamesMap.json';
import App from './App.tsx';
import { StyleClassesContext } from './contexts/StyleClassesContext';

// biome-ignore lint/style/noNonNullAssertion: root element exists in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StyleClassesContext.Provider value={classNamesMap as ComponentClassNameMapJSON}>
        <App />
      </StyleClassesContext.Provider>
    </BrowserRouter>
  </StrictMode>
);
