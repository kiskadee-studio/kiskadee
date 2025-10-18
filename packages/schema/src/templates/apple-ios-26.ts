import { breakpoints } from '../breakpoints';
import type { Palette, Schema } from '../schema';

export const palette: Palette = {
  p1: {
    primary: {
      // Range 0-100: 100% to 90% lightness with 1% decrements (11 tones total)
      0: [206, 100, 100, 1], // 100% lightness (white/lightest)
      10: [206, 100, 99, 1], // 99% lightness
      20: [206, 100, 98, 1], // 98% lightness
      30: [206, 100, 97, 1], // 97% lightness
      40: [206, 100, 96, 1], // 96% lightness
      50: [206, 100, 95, 1], // 95% lightness
      60: [206, 100, 94, 1], // 94% lightness
      70: [206, 100, 93, 1], // 93% lightness
      80: [206, 100, 92, 1], // 92% lightness
      90: [206, 100, 91, 1], // 91% lightness
      100: [206, 100, 90, 1], // 90% lightness (end of 10% range from top)
      // Range 100-500: distribute (90% - 50%) = 40% across 4 steps
      200: [206, 100, 80, 1], // 80% lightness
      300: [206, 100, 70, 1], // 70% lightness
      400: [206, 100, 60, 1], // 60% lightness
      500: [206, 100, 50, 1], // 50% lightness - #0091FF - ANCHOR (unchanged)
      // Range 500-1000: distribute (50% - 0%) = 50% across 5 steps
      600: [206, 100, 40, 1], // 40% lightness
      700: [206, 100, 30, 1], // 30% lightness
      800: [206, 100, 20, 1], // 20% lightness
      900: [206, 100, 10, 1], // 10% lightness
      1000: [206, 100, 0, 1] // 0% lightness (black/darkest)
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
  name: 'ios',
  version: [26, 0, 0],
  author: 'Apple',
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
              // 's:sm:1': 8,
              's:md:1': 16
              // 's:lg:1': 16,
              // 's:lg:2': 32,
              // 's:lg:3': 48
            },
            paddingBottom: {
              // 's:sm:1': 8,
              's:md:1': 16
              // 's:lg:1': 16,
              // 's:lg:2': 32,
              // 's:lg:3': 48
            },
            paddingLeft: {
              // 's:sm:1': 12,
              's:md:1': 20
              // 's:lg:1': 24,
              // 's:lg:2': 48,
              // 's:lg:3': 64
            },
            paddingRight: {
              // 's:sm:1': 12,
              's:md:1': 20
              // 's:lg:1': 24,
              // 's:lg:2': 48,
              // 's:lg:3': 64
            },
            borderRadius: {
              // 's:sm:1': 18,
              's:md:1': 25
              // 's:lg:1': 28,
              // 's:lg:2': 48,
              // 's:lg:3': 68
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
              // rest: 20,
              // // hover: 14,
              // // pressed: 16,
              // // focus: 14
              // selected: {
              //   rest: 16,
              //   hover: 14,
              //   pressed: 12,
              //   focus: 14
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
            textSize: {
              // 's:sm:1': 14,
              's:md:1': 17
              // 's:lg:1': 16,
              // 's:lg:2': 24,
              // 's:lg:3': 32
            },
            textHeight: {
              // 's:sm:1': 20,
              's:md:1': 18
              // 's:lg:1': 24,
              // 's:lg:2': 32,
              // 's:lg:3': 40
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
