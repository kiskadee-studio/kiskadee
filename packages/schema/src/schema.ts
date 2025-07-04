import type { DecorationSchema } from './types/appearance/appearance.types';
import type { ScaleSchema } from './types/dimensions/dimensions.types';
import type { InteractionState, ColorSchema, SemanticColor } from './types/palettes/palettes.types';
import { type Breakpoints, breakpoints, type ElementSizeValue } from './breakpoints';

// Nome de todos os componentes suportados
export type ComponentName = 'button' | 'tab';

// Unique identifier for each color palette variation within a theme
type PaletteName = string;

// TODO: Does this partial structure make sense?
type ElementStyle = {
  decorations?: DecorationSchema;
  scales?: ScaleSchema;
  // This layer (Record) allows the Style structure to support multiple color variations within a
  // white-label theme
  palettes?: Record<PaletteName, ColorSchema>;
};

type Elements = Record<ElementName, ElementStyle>;

// -------------------------------------------------------------------------------------------------
type StyleKey = string;

/**
 * Element name by component. Initially using generic names like e1, e2, etc, but may need specific
 * names in the future.
 */
export type ElementName = string;

// Mapping of style keys by interaction state per element
type StyleKeysByInteractionState = Record<InteractionState, StyleKey[]>;

export interface StyleKeyByElement {
  decorations: StyleKey[];
  effects: StyleKeysByInteractionState;
  scales: Record<ElementSizeValue, StyleKeysByInteractionState>;
  palettes: Record<
    PaletteName,
    {
      [K in SemanticColor]?: StyleKeysByInteractionState;
    }
  >;
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
            textDecoration: 'underline',
            // textTransform: 'uppercase',
            textAlign: 'center',
            // cursor: 'pointer',
            borderStyle: 'solid',
            shadowColor: { rest: [0, 0, 0, 0.5] },
            shadowBlur: {
              // TODO: setting rest makes sense for shadow?
              rest: 0,
              hover: 4
            },
            shadowY: {
              rest: 0,
              hover: 4
            },
            shadowX: {
              rest: 0,
              hover: 4
            }

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
            paddingRight: 8, // size "medium" for "all" breakpoints
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
          }
        },
        e2: {
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
