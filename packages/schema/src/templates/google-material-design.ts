import { breakpoints } from '../breakpoints';
import type { Schema } from '../schema';
import type { SchemaSegments } from '../types/colors/colors.types';

/**
 * Segments definition for the Material Design 3 design system.
 * Each segment represents a brand/product identity with support for multiple theme modes.
 *
 * Current implementation includes:
 * - material: Primary segment with light theme (purple brand color HSL 256°)
 *
 * All segments include universal semantic colors:
 * - primary: Brand identity color (varies by segment)
 * - secondary: Supporting brand color
 * - greenLike: Success, purchase, confirmation, profit (always green ~140°)
 * - yellowLike: Attention, warning, caution (always yellow ~45°)
 * - redLike: Danger, error, urgent, notification (always red ~0°)
 * - neutral: Text, backgrounds, borders, dividers (always grayscale)
 */
export const segments: SchemaSegments = {
  material: {
    name: 'Material Design',
    themes: {
      light: {
        primary: {
          soft: {
            // Soft track: 0–30 every 1% darkness
            0: [256, 34, 100, 1], // 0% darkness (white/lightest)
            1: [256, 34, 99, 1], // 1% darkness
            2: [256, 34, 98, 1], // 2% darkness
            3: [256, 34, 97, 1], // 3% darkness
            4: [256, 34, 96, 1], // 4% darkness
            5: [256, 34, 95, 1], // 5% darkness
            6: [256, 34, 94, 1], // 6% darkness
            7: [256, 34, 93, 1], // 7% darkness
            8: [256, 34, 92, 1], // 8% darkness
            9: [256, 34, 91, 1], // 9% darkness
            10: [256, 34, 90, 1], // 10% darkness
            11: [256, 34, 89, 1], // 11% darkness
            12: [256, 34, 88, 1], // 12% darkness
            13: [256, 34, 87, 1], // 13% darkness
            14: [256, 34, 86, 1], // 14% darkness
            15: [256, 34, 85, 1], // 15% darkness
            16: [256, 34, 84, 1], // 16% darkness
            17: [256, 34, 83, 1], // 17% darkness
            18: [256, 34, 82, 1], // 18% darkness
            19: [256, 34, 81, 1], // 19% darkness
            20: [256, 34, 80, 1], // 20% darkness
            21: [256, 34, 79, 1], // 21% darkness
            22: [256, 34, 78, 1], // 22% darkness
            23: [256, 34, 77, 1], // 23% darkness
            24: [256, 34, 76, 1], // 24% darkness
            25: [256, 34, 75, 1], // 25% darkness
            26: [256, 34, 74, 1], // 26% darkness
            27: [256, 34, 73, 1], // 27% darkness
            28: [256, 34, 72, 1], // 28% darkness
            29: [256, 34, 71, 1], // 29% darkness
            30: [256, 34, 70, 1] // 30% darkness
          },
          solid: {
            // Solid track: 40–100 every 5% darkness (40,45,…,95,100); 50 is the anchor
            40: [256, 34, 60, 1], // 40% darkness
            45: [256, 34, 55, 1], // 45% darkness
            50: [256, 34, 50, 1], // 50% darkness - #6750A4 - ANCHOR (unchanged)
            55: [256, 34, 45, 1], // 55% darkness
            60: [256, 34, 40, 1], // 60% darkness
            65: [256, 34, 35, 1], // 65% darkness
            70: [256, 34, 30, 1], // 70% darkness
            75: [256, 34, 25, 1], // 75% darkness
            80: [256, 34, 20, 1], // 80% darkness
            85: [256, 34, 15, 1], // 85% darkness
            90: [256, 34, 10, 1], // 90% darkness
            95: [256, 34, 5, 1], // 95% darkness
            100: [256, 34, 0, 1] // 100% darkness (black/darkest)
          }
        },
        secondary: {
          soft: {
            0: [180, 0, 100, 1],
            1: [180, 20, 92, 1],
            5: [180, 40, 75, 1],
            10: [180, 50, 60, 1]
          },
          solid: {
            50: [180, 60, 40, 1],
            100: [180, 60, 5, 1]
          }
        },
        greenLike: {
          soft: {
            0: [140, 0, 100, 1],
            1: [140, 30, 90, 1],
            5: [140, 50, 70, 1],
            10: [140, 60, 55, 1]
          },
          solid: {
            50: [140, 70, 40, 1], // Green mid-tone for "buy", "confirm"
            100: [140, 70, 5, 1]
          }
        },
        yellowLike: {
          soft: {
            0: [45, 0, 100, 1],
            1: [45, 40, 90, 1],
            5: [45, 80, 75, 1],
            10: [45, 90, 60, 1]
          },
          solid: {
            50: [45, 95, 50, 1], // Yellow/amber for "attention"
            100: [45, 95, 10, 1]
          }
        },
        redLike: {
          soft: {
            0: [0, 0, 100, 1],
            1: [0, 40, 90, 1],
            5: [0, 70, 75, 1],
            10: [0, 80, 60, 1]
          },
          solid: {
            50: [0, 85, 50, 1], // Red mid-tone for "urgent", "notification"
            100: [0, 85, 10, 1]
          }
        },
        neutral: {
          soft: {
            // Range 0-10: 100% to 90% lightness with 1% decrements (11 tones total)
            0: [0, 0, 100, 1], // 100% lightness (white/lightest)
            1: [0, 0, 99, 1], // 99% lightness
            2: [0, 0, 98, 1], // 98% lightness
            3: [0, 0, 97, 1], // 97% lightness
            4: [0, 0, 96, 1], // 96% lightness
            5: [0, 0, 95, 1], // 95% lightness
            6: [0, 0, 94, 1], // 94% lightness
            7: [0, 0, 93, 1], // 93% lightness
            8: [0, 0, 92, 1], // 92% lightness
            9: [0, 0, 91, 1], // 91% lightness
            10: [0, 0, 90, 1], // 90% lightness (end of 10% range from top)
            // Range 10-30
            20: [0, 0, 80, 1], // 80% lightness
            30: [0, 0, 70, 1] // 70% lightness
          },
          solid: {
            40: [0, 0, 60, 1], // 60% lightness
            50: [0, 0, 50, 1], // 50% lightness - #000 - ANCHOR (unchanged)
            60: [0, 0, 40, 1], // 40% lightness
            70: [0, 0, 30, 1], // 30% lightness
            80: [0, 0, 20, 1], // 20% lightness
            90: [0, 0, 10, 1], // 10% lightness
            100: [0, 0, 0, 1] // 0% lightness (black/darkest)
          }
        }
      }
    }
  }
};

const materialLight = segments.material.themes.light;

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
                  soft: {
                    rest: materialLight!.primary.solid[50]!,
                    // hover: [256, 34, 48, 1], // official
                    hover: materialLight!.primary.solid[40],
                    pressed: materialLight!.primary.solid[60],
                    disabled: materialLight!.neutral.soft[10],
                    focus: materialLight!.primary.solid[50],
                    selected: {
                      rest: materialLight!.primary.soft[10]!,
                      hover: materialLight!.primary.soft[8],
                      pressed: materialLight!.primary.soft[20]
                    }
                  },
                  solid: {
                    rest: materialLight!.primary.solid[50]!,
                    // hover: [256, 34, 48, 1], // official
                    hover: materialLight!.primary.solid[40],
                    pressed: materialLight!.primary.solid[60],
                    disabled: materialLight!.neutral.soft[10],
                    focus: materialLight!.primary.solid[50],
                    selected: {
                      rest: materialLight!.primary.soft[10]!,
                      hover: materialLight!.primary.soft[8],
                      pressed: materialLight!.primary.soft[20]
                    }
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
                  soft: {
                    rest: [0, 0, 100, 1],
                    disabled: { ref: materialLight!.neutral.solid[60]! },
                    selected: {
                      rest: { ref: materialLight!.neutral.solid[70]! }
                    }
                  },
                  solid: {
                    rest: [0, 0, 100, 1],
                    disabled: { ref: materialLight!.neutral.solid[60]! },
                    selected: {
                      rest: { ref: materialLight!.neutral.solid[70]! }
                    }
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
                  soft: {
                    rest: [207, 90, 54, 1]
                  },
                  solid: {
                    rest: [207, 90, 54, 1]
                  }
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
                  soft: {
                    // TODO: rest is mandatory, but in this case it's not needed
                    rest: [207, 90, 54, 1],
                    selected: { rest: [207, 90, 54, 1] }
                    // hover: [207, 90, 64, 1]
                  },
                  solid: {
                    rest: [207, 90, 54, 1],
                    selected: { rest: [207, 90, 54, 1] }
                  }
                },
                neutral: {
                  soft: {
                    rest: [0, 0, 75, 1]
                    // hover: [0, 0, 95, 1]
                  },
                  solid: {
                    rest: [0, 0, 75, 1]
                    // hover: [0, 0, 95, 1]
                  }
                }
              }
            },
            p2: {
              boxColor: {
                primary: {
                  soft: {
                    // TODO: rest is mandatory, but in this case it's not needed
                    rest: [207, 90, 54, 1],
                    selected: { rest: [207, 90, 54, 1] }
                    // hover: [207, 90, 64, 1]
                  },
                  solid: {
                    rest: [207, 90, 54, 1],
                    selected: { rest: [207, 90, 54, 1] }
                  }
                },
                neutral: {
                  soft: {
                    rest: [0, 0, 75, 1]
                    // hover: [0, 0, 95, 1]
                  },
                  solid: {
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
  }
};
