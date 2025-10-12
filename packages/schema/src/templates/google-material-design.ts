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
            paddingTop: {
              's:sm:1': 10,
              's:md:1': 12,
              's:lg:1': 14
            },
            paddingBottom: {
              's:sm:1': 10,
              's:md:1': 12,
              's:lg:1': 14
            },
            paddingLeft: {
              's:sm:1': 16,
              's:md:1': 18,
              's:lg:1': 20
            },
            paddingRight: {
              's:sm:1': 16,
              's:md:1': 18,
              's:lg:1': 20
            },
            borderRadius: 20
          },
          palettes: {
            p1: {
              boxColor: {
                primary: {
                  rest: [256.43, 34.43, 47.84, 1],
                  // hover: [256, 34, 48, 1], // official
                  hover: [256, 34, 65, 1],
                  pressed: [256, 34, 35, 1],
                  disabled: [256.43, 34.43, 47.84, 0.5],
                  focus: [339.61, 82.19, 51.57, 1],
                  selected: {
                    rest: [210, 98.33, 47.06, 1],
                    hover: [210, 98.33, 62, 1],
                    pressed: [210, 98.33, 35, 1]
                  }
                }
              }
            }
          },
          effects: {
            // Material Design 3 interaction-driven shape. Border radius decreases as interaction intensifies
            // (rest > hover/focus > pressed), emulating MD3 "animated corners". This enables Kiskadee to
            // generate stateful CSS for rounded corners.
            borderRadius: {
              rest: 20,
              hover: 14,
              pressed: 8,
              focus: 14
              // selected: {
              //   rest: 0,
              //   hover: 12,
              //   pressed: 0,
              //   focus: 24
              // }
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
                  selected: { rest: [207, 90, 54, 1] }
                  // hover: [207, 90, 64, 1]
                },
                neutral: {
                  rest: [0, 0, 75, 1]
                  // hover: [0, 0, 95, 1]
                }
              }
            },
            p2: {
              boxColor: {
                primary: {
                  // TODO: rest is mandatory, but in this case it's not needed
                  rest: [207, 90, 54, 1],
                  selected: { rest: [207, 90, 54, 1] }
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
