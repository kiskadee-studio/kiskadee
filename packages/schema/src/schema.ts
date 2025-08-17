import type { DecorationSchema } from './types/decorations/decorations.types';
import type { ScaleSchema } from './types/scales/scales.types';
import type { InteractionState, ColorSchema, SemanticColor } from './types/colors/colors.types';
import {
  type Breakpoints,
  breakpoints,
  type ElementAllSizeValue,
  type ElementSizeValue
} from './breakpoints';
import type { ElementEffects } from './types/effects/effects.types';

// Nome de todos os componentes suportados
export type ComponentName = 'button' | 'tab';

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
 * Element name by component. Initially using generic names like e1, e2, etc, but may need specific
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

export const schema: Schema = {
  breakpoints,
  components: {
    button: {
      elements: {
        e1: {
          decorations: {
            textItalic: true,
            textWeight: 'bold',
            textLineType: 'underline',
            // textTransform: 'uppercase',
            textAlign: 'center',
            // cursor: 'pointer',
            borderStyle: 'solid'

            // TODO: maybe
            // verticalAlign: 'middle',
            // userSelect: 'none',
            // whiteSpace: 'nowrap',
            // overflow: 'hidden',
            // textOverflow: 'ellipsis',
          },
          scales: {
            textSize: {
              's:sm:1': 12,
              's:md:1': {
                'bp:all': 16,
                'bp:lg:1': 14
              }
            },
            paddingTop: 10,
            paddingRight: 8,
            paddingBottom: 8,
            paddingLeft: 8,
            marginTop: 8,
            marginRight: 16,
            marginBottom: 8,
            marginLeft: 16,
            boxHeight: {
              's:md:1': 40,
              's:lg:1': {
                'bp:all': 48,
                'bp:lg:1': 44
              }
            },
            boxWidth: 120,
            borderWidth: 1,
            borderRadius: 4,
            textHeight: 24
          },
          palettes: {
            p1: {
              textColor: { rest: [0, 0, 0, 0.5] },
              borderColor: { rest: [0, 0, 0, 0.5] },
              boxColor: {
                primary: {
                  rest: [10, 35, 100, 0],
                  hover: [10, 35, 100, 0]
                },
                danger: {
                  rest: [10, 35, 100, 0],
                  hover: [10, 35, 100, 0]
                }
                // instagram: {
                //   rest: [10, 35, 100, 0],
                //   hover: [10, 35, 100, 0],
                //   active: [10, 35, 100, 0]
                // }
              }
            },
            p2: {
              boxColor: { rest: [0, 0, 0, 0.5] }
            }
          },
          effects: {
            shadow: {
              color: { rest: [0, 0, 0, 0.5] },
              blur: {
                // TODO: setting rest makes sense for shadow?
                rest: 0,
                hover: 4
              },
              y: {
                rest: 0,
                hover: 4
              },
              x: {
                rest: 0,
                hover: 4
              }
            }
          }
        },
        e2: {
          decorations: {
            textItalic: true
          },
          scales: {
            textSize: 16
          },
          palettes: {
            p1: {
              textColor: {
                primary: {
                  rest: [0, 0, 0, 0.5],
                  hover: { ref: [0, 0, 0, 0.5] }
                }
              }
            }
          }
        }
      }
    }
  }
};
