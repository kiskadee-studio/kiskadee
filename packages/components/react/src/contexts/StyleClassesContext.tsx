import { createContext, useContext } from 'react';
import classNamesMap, { type ComponentClassNameMap } from '../../../../web-builder/build/classNamesMap';

export const StyleClassesContext = createContext<ComponentClassNameMap>(classNamesMap);

export function useStyleClasses() {
  return useContext(StyleClassesContext);
}
