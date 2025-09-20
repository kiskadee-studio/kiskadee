import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
import { createContext, useContext } from 'react';

export type KiskadeeContextValue = {
  classesMap: ComponentClassNameMapJSON;
  palette: string;
  setPalette: (value: string) => void;
};

// Default context value: empty classes map, palette 'p1', and noop setter.
export const KiskadeeContext = createContext<KiskadeeContextValue>({
  classesMap: {},
  palette: 'p1',
  setPalette: () => {}
});

export function useKiskadee() {
  return useContext(KiskadeeContext);
}
