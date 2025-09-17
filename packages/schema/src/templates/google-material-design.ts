import { breakpoints } from '../breakpoints';
import type { Schema } from '../schema';

export const schema: Schema = {
  name: 'material-design',
  version: [3, 0, 0],
  author: 'Google',
  breakpoints,
  components: {
    button: {
      elements: {
        e1: {
          decorations: {
            borderStyle: 'none'
          },
          scales: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 20
          },
          palettes: {
            p1: {
              boxColor: {
                primary: {
                  rest: [256.43, 34.43, 47.84, 1],
                  hover: [256, 34, 48, 1],
                  disabled: [256.43, 34.43, 47.84, 0.5],
                  focus: [339.61, 82.19, 51.57, 1]
                }
              }
            }
          }
        },
        e2: {
          decorations: {
            textFont: ['Roboto', 'sans-serif'],
            textWeight: 'medium'
          },
          palettes: {
            p1: {
              textColor: {
                primary: {
                  rest: [0, 0, 100, 1]
                }
              }
            }
          },
          scales: {
            textSize: 14,
            textHeight: 20
          }
        }
      }
    },
    tabs: {
      elements: {
        e1: {
          palettes: {
            p1: {
              boxColor: {
                neutral: {
                  rest: [207, 90, 54, 1]
                }
              }
            }
          },
          scales: {
            borderRadius: 8
          }
        },
        e3: {
          decorations: {
            borderStyle: 'none'
          },
          palettes: {
            p1: {
              boxColor: {
                primary: {
                  // TODO: rest is mandatory, but in this case it's not needed
                  rest: [207, 90, 54, 1],
                  selected: [207, 90, 54, 1]
                  // hover: [207, 90, 64, 1]
                },
                neutral: {
                  rest: [0, 0, 75, 1]
                  // hover: [0, 0, 95, 1]
                }
              }
            }
          }
        }
      }
    }
  }
};
