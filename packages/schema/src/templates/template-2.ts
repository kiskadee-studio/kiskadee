import { breakpoints } from '../breakpoints';
import type { Schema } from '../schema';

export const schema: Schema = {
  name: 'template-2',
  version: [0, 0, 1],
  author: 'Rodrigo Mello',
  breakpoints,
  components: {
    button: {
      elements: {
        e1: {
          decorations: {
            borderStyle: 'none'
          },
          palettes: {
            p1: {
              boxColor: {
                primary: {
                  rest: [219, 100, 50, 1]
                }
              }
            }
          }
        },
        e2: {
          palettes: {
            p1: {
              textColor: {
                primary: {
                  rest: [0, 0, 100, 1]
                }
              }
            }
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
                  selected: { rest: [207, 90, 54, 1] },
                  hover: [207, 90, 64, 1]
                },
                neutral: {
                  rest: [0, 0, 75, 1],
                  hover: [0, 0, 95, 1]
                }
              }
            }
          }
        }
      }
    }
  }
};
