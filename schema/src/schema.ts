import type { Appearance } from './types/appearance/appearance.types';
import type { BreakpointKeys, Dimensions } from './types/dimensions/dimensions.types';
import type { Palettes } from './types/palettes/palettes.types';

export type ComponentKeys = 'button';

type Style = Partial<{
  appearance: Appearance;
  dimensions: Dimensions;
  // This layer (Record) allows the Style structure to support multiple color variations within a
  // white-label theme
  palettes: Record<string, Palettes>;
}>;

type Elements = Record<string, Style>;

// Breakpoints -------------------------------------------------------------------------------------

export type Breakpoints = Partial<Record<BreakpointKeys, number>>;

// -------------------------------------------------------------------------------------------------

type Components = Record<ComponentKeys, { elements: Elements }>;

export type Schema = {
  breakpoints: Breakpoints;
  components: Components;
};

export const schema: Schema = {
  breakpoints: {
    /*
     * @link https://gs.statcounter.com/screen-resolution-stats
     */

    // Applies to all devices
    all: 0,

    // --------------------------------------------------------------------------------------------
    // Mobile portrait sizes
    // 07/28/2024
    // https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide
    // https://store.steampowered.com/hwsurvey/
    // --------------------------------------------------------------------------------------------

    /*
     * Small mobile portrait sizes:
     * iPhone 5 / SE (320)
     */
    sm1: 320,

    /*
     * Regular mobile portrait sizes:
     * Galaxy S6-S10 / S20-S24 / S24 Ultra (360) - 19.97%
     * iPhone 12/13 Mini (360)
     * iPhone 6 / 7 / 8 / X / 11 Pro (375) - 5.37%
     * Galaxy S20/S21 Plus / S22 Ultra (384)
     * iPhone 12 / 13 / 14 / 15 (390) - 7.22%
     * iPhone 14/15 Pro (393) - 7.8%
     *
     * This breakpoint covers at least 40.36% of the mobile market
     */
    sm2: 360, //+40px

    /*
     * Large mobile portrait sizes:
     * Motorola Nexus 6 (411)
     * Galaxy S9+/S10+ / Note 10/20 / S20/S21 Ultra (412) - 6.83%
     * Pixel / OnePlus (412)
     * iPhone 6/7/8 Plus / XR/XS / 11 (414) - 4.93%
     * iPhone 12/13 Pro Max / 14 Plus (428) - 2.88%
     * iPhone 14/15 Pro Max (430)
     * Pixel 8 Pro (448)
     *
     * This breakpoint covers at least 7.81% of the mobile market
     */
    sm3: 400, //+40

    // --------------------------------------------------------------------------------------------
    // Small tablet portrait and mobile landscape sizes:
    // --------------------------------------------------------------------------------------------

    /*
     * iPhone 5 (landscape)(568)
     * OnePlus Pad Go (632)
     * Galaxy Tab S4 (712)
     *
     * 601 portrait - 3.55% of the tablet market
     * 744 portrait - 2.63% of the tablet market
     */
    md1: 568, //+168

    /*
     * Small tablet portrait and mobile landscape sizes:
     * iPad Mini 4 / iPad Pro 9 (768)
     * Google Pixel Tablet (928)
     *
     * 768 portrait - 24.22% of the tablet market
     * 800 portrait - 6.34% of the tablet market
     * 810 portrait - 10.32% of the tablet market
     * 820 portrait - 5.84% of the tablet market
     * 834 portrait - 3.22% of the tablet market
     *
     * This breakpoint covers at least 49.94% of the tablet market
     */
    md2: 768, //+100px

    // --------------------------------------------------------------------------------------------
    // Tablet portrait, laptop, and small desktop sizes
    // --------------------------------------------------------------------------------------------

    /*
     * 1024 portrait - 24.22% of the tablet market
     * 1024 landscape - 3.15% of the tablet market
     * 1080 portrait - 10.32% of the tablet market
     * 1180 portrait - 5.84% of the tablet market
     * 1194 portrait - 3.22% of the tablet market
     * 1133 portrait - 2.63% of the tablet market
     *
     * This breakpoint covers at least 49.38% of the tablet market
     */
    md3: 1024, //+256

    // --------------------------------------------------------------------------------------------
    // Regular Laptop Sizes
    // --------------------------------------------------------------------------------------------

    /*
     * 1280 - 1.05% (Steam) / 9,84% (StatCounter) of the desktop market
     * 1366 - 3.41% (Steam) / 4.23% (StatCounter) of the desktop market
     *
     * This breakpoint covers at least 4.46%/14.07% of the desktop market
     * Considering scrollbar and toolbar/dock
     */
    lg1: 1152, //+128

    // --------------------------------------------------------------------------------------------
    // Large Desktop Sizes
    // --------------------------------------------------------------------------------------------

    /*
     * 1440 - 0.99% (Steam) / 5.88% (StatCounter) of the desktop market
     * 1536 - ??% (Steam) / 11% (StatCounter) of the desktop market
     * 1600 - 1.01% (Steam) / 2.9% (StatCounter) of the desktop market
     *
     * This breakpoint covers at least 1.01%/17.87% of the desktop market
     * Considering scrollbar and toolbar/dock
     */
    lg2: 1312, //+160

    /*
     * 1920 - 57.47% (Steam) / 23.14% (StatCounter) of the desktop market
     *
     * This breakpoint covers at least 57.47%/23.14% of the desktop market
     * Considering scrollbar and toolbar/dock
     */
    lg3: 1792, //+480

    /*
     * 2560 - 23.18% (Steam) / 2.84% (StatCounter) of the desktop market
     *
     * This breakpoint covers at least 23.18%/2.84% of the desktop market
     * Considering scrollbar and toolbar/dock
     */
    lg4: 2432 //+640
  },
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
              sm: 12, // minimum is 10,
              md: {
                all: 16,
                lg1: 14
              },
              lg: {
                all: 20,
                lg1: 18
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
            height: {
              md: 40, // Default
              lg: {
                all: 48,
                lg1: 44
              }
            },
            width: 120,
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
