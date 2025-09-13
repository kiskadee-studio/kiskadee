import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import classNamesMap from '../../../web-builder/build/classNamesMap';
import App from './App.tsx';
import { StyleClassesContext } from './contexts/StyleClassesContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StyleClassesContext.Provider value={classNamesMap}>
        <App />
      </StyleClassesContext.Provider>
    </BrowserRouter>
  </StrictMode>
);
