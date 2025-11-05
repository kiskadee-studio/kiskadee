import type { ComponentClassNameMapJSON, ThemeMode } from '@kiskadee/core';
import { createContext, useContext } from 'react';

export type KiskadeeContextValue = {
  classesMap: ComponentClassNameMapJSON;
  segment: string;
  theme: ThemeMode;
  setSegment: (value: string) => void;
  setTheme: (value: ThemeMode) => void;
};

// Default context value
export const KiskadeeContext = createContext<KiskadeeContextValue>({
  classesMap: {},
  segment: 'ios',
  theme: 'light',
  setSegment: () => {},
  setTheme: () => {}
});

export function useKiskadee() {
  return useContext(KiskadeeContext);
}
