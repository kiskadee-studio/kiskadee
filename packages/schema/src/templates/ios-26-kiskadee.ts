import { breakpoints } from '../breakpoints';
import type { Schema } from '../schema';
import type { SchemaSegments } from '../types/colors/colors.types';
import { color } from '../utils/color';
import { withAlpha } from '../utils/withAlpha';

// Kiskadee iOS 26: starts as a copy of Apple iOS 26; can evolve with Kiskadee opinions later

/**
 * Segments definition for the iOS 26 design system.
 * Each segment represents a brand/product identity with support for multiple theme modes.
 *
 * Current implementation includes:
 * - ios: Primary segment with light theme (blue brand color HSL 206°)
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
  ios: {
    name: 'iOS',
    themes: {
      light: {
        primary: {
          soft: {
            // Soft track: 0–30 every 1% darkness
            0: [206, 100, 100, 1], // 0% darkness (white/lightest)
            1: [206, 100, 99, 1], // 1% darkness
            2: [206, 100, 98, 1], // 2% darkness
            3: [206, 100, 97, 1], // 3% darkness
            4: [206, 100, 96, 1], // 4% darkness
            5: [206, 100, 95, 1], // 5% darkness
            6: [206, 100, 94, 1], // 6% darkness
            7: [206, 100, 93, 1], // 7% darkness
            8: [206, 100, 92, 1], // 8% darkness
            9: [206, 100, 91, 1], // 9% darkness
            10: [206, 100, 90, 1], // 10% darkness
            11: [206, 100, 89, 1], // 11% darkness
            12: [206, 100, 88, 1], // 12% darkness
            13: [206, 100, 87, 1], // 13% darkness
            14: [206, 100, 86, 1], // 14% darkness
            15: [206, 100, 85, 1], // 15% darkness
            16: [206, 100, 84, 1], // 16% darkness
            17: [206, 100, 83, 1], // 17% darkness
            18: [206, 100, 82, 1], // 18% darkness
            19: [206, 100, 81, 1], // 19% darkness
            20: [206, 100, 80, 1], // 20% darkness
            21: [206, 100, 79, 1], // 21% darkness
            22: [206, 100, 78, 1], // 22% darkness
            23: [206, 100, 77, 1], // 23% darkness
            24: [206, 100, 76, 1], // 24% darkness
            25: [206, 100, 75, 1], // 25% darkness
            26: [206, 100, 74, 1], // 26% darkness
            27: [206, 100, 73, 1], // 27% darkness
            28: [206, 100, 72, 1], // 28% darkness
            29: [206, 100, 71, 1], // 29% darkness
            30: [206, 100, 70, 1] // 30% darkness
          },
          solid: {
            // Solid track: 40–100 every 5% darkness (40,45,…,95,100); 50 is the anchor
            40: [206, 100, 60, 1], // 40% darkness
            45: [206, 100, 55, 1], // 45% darkness
            50: [206, 100, 50, 1], // 50% darkness - #0091FF - ANCHOR (unchanged)
            55: [206, 100, 45, 1], // 55% darkness
            60: [206, 100, 40, 1], // 60% darkness
            65: [206, 100, 35, 1], // 65% darkness
            70: [206, 100, 30, 1], // 70% darkness
            75: [206, 100, 25, 1], // 75% darkness
            80: [206, 100, 20, 1], // 80% darkness
            85: [206, 100, 15, 1], // 85% darkness
            90: [206, 100, 10, 1], // 90% darkness
            95: [206, 100, 5, 1], // 95% darkness
            100: [206, 100, 0, 1] // 100% darkness (black/darkest)
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
            // Soft track: 0–30 every 1% darkness
            0: [0, 0, 100, 1], // 0% darkness (white/lightest)
            1: [0, 0, 99, 1], // 1% darkness
            2: [0, 0, 98, 1], // 2% darkness
            3: [0, 0, 97, 1], // 3% darkness
            4: [0, 0, 96, 1], // 4% darkness
            5: [0, 0, 95, 1], // 5% darkness
            6: [0, 0, 94, 1], // 6% darkness
            7: [0, 0, 93, 1], // 7% darkness
            8: [0, 0, 92, 1], // 8% darkness
            9: [0, 0, 91, 1], // 9% darkness
            10: [0, 0, 90, 1], // 10% darkness
            11: [0, 0, 90, 1], // 11% darkness
            12: [0, 0, 91, 1], // 12% darkness
            13: [0, 0, 91, 1], // 13% darkness
            14: [0, 0, 91, 1], // 14% darkness
            15: [0, 0, 92, 1], // 15% darkness
            16: [0, 0, 92, 1], // 16% darkness
            17: [0, 0, 92, 1], // 17% darkness
            18: [0, 0, 92, 1], // 18% darkness
            19: [0, 0, 93, 1], // 19% darkness
            20: [0, 0, 93, 1], // 20% darkness
            21: [0, 0, 93, 1], // 21% darkness
            22: [0, 0, 93, 1], // 22% darkness
            23: [0, 0, 94, 1], // 23% darkness
            24: [0, 0, 94, 1], // 24% darkness
            25: [0, 0, 94, 1], // 25% darkness
            26: [0, 0, 94, 1], // 26% darkness
            27: [0, 0, 94, 1], // 27% darkness
            28: [0, 0, 95, 1], // 28% darkness
            29: [0, 0, 95, 1], // 29% darkness
            30: [0, 0, 95, 1] // 30% darkness
          },
          solid: {
            // Solid track: 40–100 every 5% darkness (40,45,…,95,100); 50 is the anchor
            40: [0, 0, 98, 1], // 40% darkness
            45: [0, 0, 99, 1], // 45% darkness
            50: [0, 0, 100, 1], // 50% darkness - #FFF - ANCHOR (unchanged)
            55: [0, 0, 90, 1], // 55% darkness
            60: [0, 0, 80, 1], // 60% darkness
            65: [0, 0, 70, 1], // 65% darkness
            70: [0, 0, 60, 1], // 70% darkness
            75: [0, 0, 50, 1], // 75% darkness
            80: [0, 0, 40, 1], // 80% darkness
            85: [0, 0, 30, 1], // 85% darkness
            90: [0, 0, 20, 1], // 90% darkness
            95: [0, 0, 10, 1], // 95% darkness
            100: [0, 0, 0, 1] // 100% darkness (black/darkest)
          }
        }
      }
    }
  }
};

const iosLight = segments.ios.themes.light;
const ios = segments.ios;

export const schema: Schema = {
  name: 'iOS',
  version: [26, 0, 0],
  author: 'Kiskadee',
  breakpoints,
  components: {
    button: {
      elements: {
        e1: {
          name: 'button',
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
            ios: {
              light: {
                boxColor: {
                  primary: {
                    soft: {
                      rest: color(ios, 'l', 'primary', 5),
                      hover: color(ios, 'l', 'primary', 3),
                      focus: color(ios, 'l', 'primary', 5),
                      pressed: color(ios, 'l', 'primary', 8),
                      disabled: color(ios, 'l', 'primary', 5, 20),
                      selected: {
                        rest: color(ios, 'l', 'primary', 10),
                        hover: color(ios, 'l', 'primary', 8),
                        pressed: color(ios, 'l', 'primary', 20)
                      }
                    },
                    solid: {
                      rest: color(ios, 'l', 'primary', 50),
                      hover: color(ios, 'l', 'primary', 50, 80),
                      pressed: color(ios, 'l', 'primary', 60),
                      disabled: color(ios, 'l', 'primary', 50, 20),
                      focus: color(ios, 'l', 'primary', 50),
                      selected: {
                        rest: color(ios, 'l', 'primary', 10),
                        hover: color(ios, 'l', 'primary', 8),
                        pressed: color(ios, 'l', 'primary', 20)
                      }
                    }
                  }
                }
              },
              dark: {
                boxColor: {
                  primary: {
                    solid: {
                      rest: iosLight?.primary.solid[70],
                      hover: iosLight?.primary.solid[80],
                      pressed: iosLight?.primary.solid[90]
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
                rest: withAlpha([0, 0, 0, 1], 28),
                hover: withAlpha([0, 0, 0, 1], 35),
                pressed: withAlpha([0, 0, 0, 1], 32),
                focus: withAlpha([0, 0, 0, 1], 35),
                disabled: withAlpha([0, 0, 0, 1], 0)
              }
            }
          }
        },
        e2: {
          name: 'button-text',
          decorations: {
            textFont: ['Roboto', 'sans-serif'],
            textWeight: 'medium'
          },
          palettes: {
            ios: {
              light: {
                textColor: {
                  primary: {
                    soft: {
                      rest: color(ios, 'l', 'primary', 50),
                      hover: { ref: color(ios, 'l', 'primary', 50, 80) },
                      pressed: { ref: color(ios, 'l', 'primary', 50) },
                      disabled: {
                        ref: color(ios, 'l', 'neutral', 0, 20)
                      },
                      selected: {
                        rest: {
                          ref: color(ios, 'l', 'neutral', 70)
                        }
                      }
                    },
                    solid: {
                      rest: color(ios, 'l', 'neutral', 0),
                      disabled: {
                        ref: color(ios, 'l', 'neutral', 0, 20)
                      },
                      selected: {
                        rest: {
                          ref: color(ios, 'l', 'neutral', 70)
                        }
                      }
                    }
                  }
                }
              },
              dark: {
                textColor: {
                  primary: {
                    solid: {
                      rest: iosLight?.primary.soft[0]
                    }
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
    }
  }
};
