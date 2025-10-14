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
                  rest: palette.p1.primary[500]!,
                  // hover: [256, 34, 48, 1], // official
                  hover: palette.p1.primary[400],
                  pressed: palette.p1.primary[600],
                  disabled: palette.p1.neutral[100],
                  focus: palette.p1.primary[500],
                  selected: {
                    rest: palette.p1.primary[100]!,
                    hover: palette.p1.primary[80],
                    pressed: palette.p1.primary[200]
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
              rest: 20
              // hover: 14,
              // pressed: 8,
              // focus: 14
              // selected: {
              //   rest: 0,
              //   hover: 12,
              //   pressed: 0,
              //   focus: 24
              // }
            },
            shadow: {
              // MD3-like elevation: subtle at rest, stronger on hover/pressed, focused similar to hover.
              // x stays 0 to avoid lateral drift; y and blur increase with intensity. Color stays black with varying alphas.
              x: { rest: 0, hover: 0, pressed: 0, focus: 0, disabled: 0 },
              y: { rest: 2, hover: 4, pressed: 0, focus: 4, disabled: 0 },
              blur: { rest: 6, hover: 10, pressed: 0, focus: 10, disabled: 0 },
              // HSLA: [h, s, l, a] → converted to hex with alpha by the builder
              color: {
                rest: [0, 0, 0, 0.28],
                hover: [0, 0, 0, 0.35],
                pressed: [0, 0, 0, 0.32],
                focus: [0, 0, 0, 0.35],
                disabled: [0, 0, 0, 0.0]
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
                  rest: [0, 0, 100, 1],
                  disabled: { ref: palette.p1.neutral[600]! },
                  selected: {
                    rest: { ref: palette.p1.neutral[700]! }
                  }
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
