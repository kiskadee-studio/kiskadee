import { breakpoints } from '../breakpoints';
import type { Palette, Schema } from '../schema';

export const palette: Palette = {
  p1: {
    primary: {
      // Range 0-100: 100% to 90% lightness with 1% decrements (11 tones total)
      0: [256, 34, 100, 1], // 100% lightness (white/lightest)
      10: [256, 34, 99, 1], // 99% lightness
      20: [256, 34, 98, 1], // 98% lightness
      30: [256, 34, 97, 1], // 97% lightness
      40: [256, 34, 96, 1], // 96% lightness
      50: [256, 34, 95, 1], // 95% lightness
      60: [256, 34, 94, 1], // 94% lightness
      70: [256, 34, 93, 1], // 93% lightness
      80: [256, 34, 92, 1], // 92% lightness
      90: [256, 34, 91, 1], // 91% lightness
      100: [256, 34, 90, 1], // 90% lightness (end of 10% range from top)
      // Range 100-500: distribute (90% - 48%) = 42% across 4 steps ≈ 10.5% per step
      200: [256, 34, 79, 1], // 79% lightness (90 - 10.5)
      300: [256, 34, 69, 1], // 69% lightness (79 - 10.5)
      400: [256, 34, 58, 1], // 58% lightness (69 - 10.5)
      500: [256, 34, 48, 1], // 48% lightness - #6750A4 - ANCHOR (unchanged)
      // Range 500-1000: distribute (48% - 0%) = 48% across 5 steps ≈ 9.6% per step
      600: [256, 34, 38, 1], // 38% lightness (48 - 9.6)
      700: [256, 34, 29, 1], // 29% lightness (38 - 9.6)
      800: [256, 34, 19, 1], // 19% lightness (29 - 9.6)
      900: [256, 34, 10, 1], // 10% lightness (19 - 9.6)
      1000: [256, 34, 0, 1] // 0% lightness (black/darkest)
    },
    secondary: {
      0: [180, 0, 100, 1],
      10: [180, 20, 92, 1],
      50: [180, 40, 75, 1],
      100: [180, 50, 60, 1],
      500: [180, 60, 40, 1],
      1000: [180, 60, 5, 1]
    },
    'green-like': {
      0: [140, 0, 100, 1],
      10: [140, 30, 90, 1],
      50: [140, 50, 70, 1],
      100: [140, 60, 55, 1],
      500: [140, 70, 40, 1], // Green mid-tone for "buy", "confirm"
      1000: [140, 70, 5, 1]
    },
    'yellow-like': {
      0: [45, 0, 100, 1],
      10: [45, 40, 90, 1],
      50: [45, 80, 75, 1],
      100: [45, 90, 60, 1],
      500: [45, 95, 50, 1], // Yellow/amber for "attention"
      1000: [45, 95, 10, 1]
    },
    'red-like': {
      0: [0, 0, 100, 1],
      10: [0, 40, 90, 1],
      50: [0, 70, 75, 1],
      100: [0, 80, 60, 1],
      500: [0, 85, 50, 1], // Red mid-tone for "urgent", "notification"
      1000: [0, 85, 10, 1]
    },
    neutral: {
      // Range 0-100: 100% to 90% lightness with 1% decrements (11 tones total)
      0: [0, 0, 100, 1], // 100% lightness (white/lightest)
      10: [0, 0, 99, 1], // 99% lightness
      20: [0, 0, 98, 1], // 98% lightness
      30: [0, 0, 97, 1], // 97% lightness
      40: [0, 0, 96, 1], // 96% lightness
      50: [0, 0, 95, 1], // 95% lightness
      60: [0, 0, 94, 1], // 94% lightness
      70: [0, 0, 93, 1], // 93% lightness
      80: [0, 0, 92, 1], // 92% lightness
      90: [0, 0, 91, 1], // 91% lightness
      100: [0, 0, 90, 1], // 90% lightness (end of 10% range from top)
      // Range 100-500: distribute (90% - 50%) = 40% across 4 steps
      200: [0, 0, 80, 1], // 80% lightness
      300: [0, 0, 70, 1], // 70% lightness
      400: [0, 0, 60, 1], // 60% lightness
      500: [0, 0, 50, 1], // 50% lightness - #000 - ANCHOR (unchanged)
      // Range 500-1000: distribute (50% - 0%) = 50% across 5 steps
      600: [0, 0, 40, 1], // 40% lightness
      700: [0, 0, 30, 1], // 30% lightness
      800: [0, 0, 20, 1], // 20% lightness
      900: [0, 0, 10, 1], // 10% lightness
      1000: [0, 0, 0, 1] // 0% lightness (black/darkest)
    }
  }
};

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
              's:sm:1': 8,
              's:md:1': 10,
              's:lg:1': 16,
              's:lg:2': 32,
              's:lg:3': 48
            },
            paddingBottom: {
              's:sm:1': 8,
              's:md:1': 10,
              's:lg:1': 16,
              's:lg:2': 32,
              's:lg:3': 48
            },
            paddingLeft: {
              's:sm:1': 12,
              's:md:1': 16,
              's:lg:1': 24,
              's:lg:2': 48,
              's:lg:3': 64
            },
            paddingRight: {
              's:sm:1': 12,
              's:md:1': 16,
              's:lg:1': 24,
              's:lg:2': 48,
              's:lg:3': 64
            },
            borderRadius: {
              's:sm:1': 18,
              's:md:1': 20,
              's:lg:1': 28,
              's:lg:2': 48,
              's:lg:3': 68
            }
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
              rest: 20,
              // hover: 14,
              // pressed: 16,
              // focus: 14
              selected: {
                rest: 16,
                hover: 14,
                pressed: 12,
                focus: 14
              }
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
            textSize: {
              's:sm:1': 14,
              's:md:1': 14,
              's:lg:1': 16,
              's:lg:2': 24,
              's:lg:3': 32
            },
            textHeight: {
              // TODO: Bug, tá gerando duplicado, pq a style key tem tamanho
              's:sm:1': 20,
              's:md:1': 20,
              's:lg:1': 24,
              's:lg:2': 32,
              's:lg:3': 40
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
