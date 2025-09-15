import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
import { createContext, useContext } from 'react';

export type StyleClassesContextValue = {
  classesMap: ComponentClassNameMapJSON;
  palette: string;
  setPalette: (value: string) => void;
};

// Default context value: empty classes map, palette 'p1', and noop setter.
export const StyleClassesContext = createContext<StyleClassesContextValue>({
  classesMap: {},
  palette: 'p1',
  setPalette: () => {}
});

export function useStyleClasses() {
  return useContext(StyleClassesContext);
}
