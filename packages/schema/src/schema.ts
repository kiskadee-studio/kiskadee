import type { Breakpoints, ElementAllSizeValue, ElementSizeValue } from './breakpoints';
import type { ColorSchema, InteractionState, SemanticColor } from './types/colors/colors.types';
import type { DecorationSchema } from './types/decorations/decorations.types';
import type { ElementEffects } from './types/effects/effects.types';
import type { ScaleSchema } from './types/scales/scales.types';

// Nome de todos os componentes suportados
export type ComponentName = 'button' | 'tabs';

// Unique identifier for each color palette variation within a theme
export type PaletteName = string;

export type ElementColors = Record<PaletteName, ColorSchema>;

export type ElementStyle = Partial<{
  decorations: DecorationSchema;
  scales: ScaleSchema;
  // This layer (Record) allows the Style structure to support multiple color variations within a
  // white-label theme
  palettes: ElementColors;
  effects: ElementEffects;
}>;

type Elements = Record<ElementName, ElementStyle>;

// -------------------------------------------------------------------------------------------------
export type StyleKey = string;

/**
 * Element name by component. Initially using generic names like e1, e2, etc., but may need specific
 * names in the future.
 */
export type ElementName = string;

// Mapping of style keys by interaction state per element
export type StyleKeysByInteractionState = Partial<Record<InteractionState, StyleKey[]>>;

export type InteractionStateBySemanticColor = Partial<{
  [K in SemanticColor]: StyleKeysByInteractionState;
}>;

export interface StyleKeyByElement {
  decorations: StyleKey[];
  effects: StyleKeysByInteractionState;
  scales: Partial<Record<ElementSizeValue | ElementAllSizeValue, StyleKey[]>>;
  palettes: Record<PaletteName, InteractionStateBySemanticColor>;
}

export type ComponentStyleKeyMap = Partial<{
  [componenteName in ComponentName]: {
    [elementName: ElementName]: StyleKeyByElement;
  };
}>;

// Legacy, delete it
export interface ClassNameMap {
  [componenteName: string]: {
    [elementName: string]: Partial<Record<InteractionState, string[]>>;
  };
}

// export interface ClassNameMap {
//   [componenteName: string]: {
//     [elementName: string]: Partial<Record<InteractionState, string[]>>;
//   };
// }
//
// // Input
// const classNameMap: ClassNameMap = {
//   button: {
//     e1: {
//       rest: ['bg-primary-500', 'text-white'],
//       hover: ['bg-primary-600']
//     }
//   }
// };

// -------------------------------------------------------------------------------------------------

type Components = Partial<Record<ComponentName, { elements: Elements }>>;

export type Schema = {
  breakpoints: Breakpoints;
  components: Components;
};

// Types describing the JSON artifact produced by web-builder (classNamesMap.json)
export type ClassNamesByInteractionStateJSON = Partial<Record<string, string[]>>;
export type ClassNameByElementJSON = {
  decorations?: string[];
  effects?: ClassNamesByInteractionStateJSON;
  scales?: Partial<Record<string, string[]>>;
  palettes?: Record<string, Partial<Record<string, ClassNamesByInteractionStateJSON>>>;
};

export type ComponentClassNameMapJSON = Partial<
  Record<string, Record<string, ClassNameByElementJSON>>
>;
