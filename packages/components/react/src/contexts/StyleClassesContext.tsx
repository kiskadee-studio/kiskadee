import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
import { createContext, useContext } from 'react';
import classNamesMap from '../../../../web-builder/build/classNamesMap.json';

export const StyleClassesContext = createContext<ComponentClassNameMapJSON>(
  classNamesMap as ComponentClassNameMapJSON
);

export function useStyleClasses() {
  return useContext(StyleClassesContext);
}
