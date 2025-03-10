import type { Appearance } from './types/appearance/appearance.types';
import type { Dimensions } from './types/dimensions/dimensions.types';
import type { Palettes } from './types/palettes/palettes.types';
import { type Breakpoints, breakpoints } from './breakpoints';

export type ComponentKeys = 'button';

type Style = Partial<{
  appearance: Appearance;
  dimensions: Dimensions;
  // This layer (Record) allows the Style structure to support multiple color variations within a
  // white-label theme
  palettes: Record<string, Palettes>;
}>;

type Elements = Record<string, Style>;

// -------------------------------------------------------------------------------------------------

type Components = Record<ComponentKeys, { elements: Elements }>;

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
          appearance: {
            textItalic: true,
            textWeight: 'bold',
            textDecoration: 'underline',
            textTransform: 'uppercase',
            textAlign: 'center',
            cursor: 'pointer',
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
          dimensions: {
            textSize: {
              s_sm: 12,
              s_md: {
                bp_all: 16,
                bp_lg_1: 14
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
              s_md: 40, // Default
              s_lg: {
                bp_all: 48,
                bp_lg_1: 44
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
              bgColor: {
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
              // TODO: implement reference to another element
              // ref: 'e1',
              bgColor: { rest: [0, 0, 0, 0.5] }
            }
          }
        },
        e2: {
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
