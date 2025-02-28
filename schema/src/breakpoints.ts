export const breakpoints = {
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
};
