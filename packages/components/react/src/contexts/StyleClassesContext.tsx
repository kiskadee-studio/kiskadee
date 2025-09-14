import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
import { createContext, useContext } from 'react';
import classNamesMap from '../../../../web-builder/build/classNamesMap.json';

export type StyleClassesContextValue = {
  classesMap: ComponentClassNameMapJSON;
  palette: string;
  setPalette: (value: string) => void;
};

// Default context value: classes map from build, palette 'p1', and noop setter.
export const StyleClassesContext = createContext<StyleClassesContextValue>({
  classesMap: classNamesMap as ComponentClassNameMapJSON,
  palette: 'p1',
  setPalette: () => {}
});

export function useStyleClasses() {
  return useContext(StyleClassesContext);
}
