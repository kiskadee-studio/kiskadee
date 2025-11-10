import type { ComponentClassNameMapJSON, ThemeMode } from '@kiskadee/core';
import { createContext, useContext } from 'react';

export type TemplateManifest = {
  displayName?: string;
  [key: string]: unknown;
};

export type KiskadeeContextValue = {
  classesMap: ComponentClassNameMapJSON;
  segment: string;
  theme: ThemeMode;
  setSegment: (value: string) => void;
  setTheme: (value: ThemeMode) => void;

  // Expose template controls and options
  template: string;
  setTemplate: (value: string) => void;
  availableSegments: string[];
  availableThemes: string[];
  templateKeys: string[];
  templateMeta: Record<string, TemplateManifest>;
};

// Default context value
export const KiskadeeContext = createContext<KiskadeeContextValue>({
  classesMap: {},
  segment: 'ios',
  theme: 'light',
  setSegment: () => {},
  setTheme: () => {},
  template: 'ios-26-apple',
  setTemplate: () => {},
  availableSegments: [],
  availableThemes: [],
  templateKeys: [],
  templateMeta: {}
});

export function useKiskadee() {
  return useContext(KiskadeeContext);
}
