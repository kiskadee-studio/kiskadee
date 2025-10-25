import { breakpoints } from '../breakpoints';
import type { Schema } from '../schema';

export const schema: Schema = {
  name: 'template-1',
  version: [0, 0, 1],
  author: 'Rodrigo Mello',
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
              borderColor: { rest: [0, 0, 0, 0.5] }
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
              textColor: {}
            }
          }
        }
      }
    }
  }
};
