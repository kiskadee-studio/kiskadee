import type { InteractionStates, SingleColor } from '../palettes/palettes.types';

// Italic ------------------------------------------------------------------------------------------

export type TextItalic = boolean;

export enum CssFontStyleValue {
  italic = 'italic',
  normal = 'normal'
}

// type BackgroundColor = SingleColor;

// Text Weight -------------------------------------------------------------------------------------

export type TextWeightValue =
  | 'thin'
  | 'extraLight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semiBold'
  | 'bold'
  | 'extraBold'
  | 'black';

export enum CssTextWeightValue {
  thin = '100',
  extraLight = '200',
  light = '300',
  normal = '400',
  medium = '500',
  semiBold = '600',
  bold = '700',
  extraBold = '800',
  black = '900'
}

// Text Decoration ---------------------------------------------------------------------------------

// TODO: Should "underline dotted", "overline" and "underline dotted red" be supported?
// TODO: Where is the default value defined?
export type TextDecorationValue =
  | 'none' // default
  | 'underline'
  | 'lineThrough';

export enum CssTextDecorationValue {
  none = 'none',
  underline = 'underline',
  lineThrough = 'line-through'
}

// Text Transform ----------------------------------------------------------------------------------

// TODO: Is it really necessary?
// export type TextTransform =
//   | 'none' // default
//   | 'uppercase'
//   | 'lowercase'
//   | 'capitalize';

// Text Align --------------------------------------------------------------------------------------

// TODO: Should "right" be the default in languages read from right to left, such as Japanese?
// TODO: I'm not sure if the "justify" value will actually be used
// TODO: What does "default" mean? So far there is no specific treatment for that

export type TextAlignValue =
  | 'left' // default
  | 'center'
  | 'right'
  | 'justify';

export enum CssTextAlignValue {
  left = 'left',
  center = 'center',
  right = 'right',
  justify = 'justify'
}

// -------------------------------------------------------------------------------------------------

// TODO: Is it really necessary?
// TODO: maybe it's necessary to create a platform level, as it might not be possible to use the same cursor across all platforms
export enum CursorValues {
  /**
   * Default cursor adjusted based on context.
   * Supported on Windows (system default arrow), macOS (contextual arrow) and Linux.
   */
  auto = 'auto',

  /**
   * System default cursor.
   * Supported on Windows (arrow), macOS (arrow) and Linux.
   */
  default = 'default',

  /**
   * Hides the cursor.
   * In native applications on Windows, macOS, and Linux a custom implementation is required.
   */
  none = 'none',

  /**
   * Cursor for context menus.
   * Not supported natively on Windows, macOS, and Linux (no native equivalent exists).
   */
  contextMenu = 'context-menu',

  /**
   * Help cursor.
   * On Windows it is equivalent to IDC_HELP; on macOS and Linux, use the default help pointer if available.
   */
  help = 'help',

  /**
   * Pointer cursor for interactive elements.
   * Supported on Windows (hand icon), macOS (pointing hand), and Linux.
   */
  pointer = 'pointer',

  /**
   * Indicates ongoing progress.
   * May require a custom implementation on Windows, macOS, and Linux if a native progress cursor is not available.
   */
  progress = 'progress',

  /**
   * Wait (busy) cursor.
   * Supported on Windows (hourglass or spinning circle), macOS (spinning beach ball) and Linux.
   */
  wait = 'wait',

  /**
   * Cursor for cell selection.
   * Not commonly mapped on Windows, macOS, and Linux; may require a custom implementation.
   */
  cell = 'cell',

  /**
   * Crosshair cursor for precision targeting.
   * Supported natively as "crosshair" on Windows, macOS, and Linux.
   */
  crosshair = 'crosshair',

  /**
   * Text cursor.
   * Supported on Windows (I-beam), macOS (I-beam) and Linux.
   */
  text = 'text',

  /**
   * Vertical text cursor.
   * Not supported natively on Windows, macOS, and Linux (no direct native equivalent).
   */
  verticalText = 'vertical-text',

  /**
   * Alias cursor.
   * Not natively supported on Windows, macOS, and Linux; may require custom implementation.
   */
  alias = 'alias',

  /**
   * Copy cursor.
   * Not natively supported on Windows, macOS, and Linux; may require custom implementation.
   */
  copy = 'copy',

  /**
   * Cursor indicating movement.
   * Supported on Windows, macOS, and Linux as a move cursor.
   */
  move = 'move',

  /**
   * Indicates that an item cannot be dropped.
   * Supported on Windows, macOS, and Linux as a "no drop" cursor.
   */
  noDrop = 'no-drop',

  /**
   * Not allowed cursor.
   * Supported on Windows (circle with a slash), macOS, and Linux.
   */
  notAllowed = 'not-allowed',

  /**
   * Cursor indicating that an element can be grabbed.
   * On Windows and macOS it is equivalent to an open hand; on Linux, a similar open-hand icon is used.
   */
  grab = 'grab',

  /**
   * Cursor indicating an element is being grabbed.
   * Often implemented as a closed hand on Windows and macOS; may require a custom implementation on Linux.
   */
  grabbing = 'grabbing',

  /**
   * All-direction scroll cursor.
   * Supported on Windows, macOS, and Linux as the all-scroll cursor.
   */
  allScroll = 'all-scroll',

  /**
   * Horizontal resize cursor.
   * Supported on Windows (horizontal double arrow), macOS, and Linux.
   */
  colResize = 'col-resize',

  /**
   * Vertical resize cursor.
   * Supported on Windows (vertical double arrow), macOS, and Linux.
   */
  rowResize = 'row-resize',

  /**
   * Resize cursor for north direction.
   * Supported on Windows, macOS, and Linux.
   */
  nResize = 'n-resize',

  /**
   * Resize cursor for east direction.
   * Supported on Windows, macOS, and Linux.
   */
  eResize = 'e-resize',

  /**
   * Resize cursor for south direction.
   * Supported on Windows, macOS, and Linux.
   */
  sResize = 's-resize',

  /**
   * Resize cursor for west direction.
   * Supported on Windows, macOS, and Linux.
   */
  wResize = 'w-resize',

  /**
   * Resize cursor diagonally towards the northeast.
   * Supported on Windows, macOS, and Linux.
   */
  neResize = 'ne-resize',

  /**
   * Resize cursor diagonally towards the northwest.
   * Supported on Windows, macOS, and Linux.
   */
  nwResize = 'nw-resize',

  /**
   * Resize cursor diagonally towards the southeast.
   * Supported on Windows, macOS, and Linux.
   */
  seResize = 'se-resize',

  /**
   * Resize cursor diagonally towards the southwest.
   * Supported on Windows, macOS, and Linux.
   */
  swResize = 'sw-resize',

  /**
   * Alias for horizontal resize.
   * Supported on Windows, macOS, and Linux.
   */
  ewResize = 'ew-resize',

  /**
   * Alias for vertical resize.
   * Supported on Windows, macOS, and Linux.
   */
  nsResize = 'ns-resize',

  /**
   * Diagonal resize cursor for northeast-southwest direction.
   * Supported on Windows, macOS, and Linux.
   */
  neswResize = 'nesw-resize',

  /**
   * Diagonal resize cursor for northwest-southeast direction.
   * Supported on Windows, macOS, and Linux.
   */
  nwseResize = 'nwse-resize',

  /**
   * Zoom in cursor.
   * Not supported natively on Windows, macOS, and Linux (no direct equivalent exists); requires custom implementation.
   */
  zoomIn = 'zoom-in',

  /**
   * Zoom out cursor.
   * Not supported natively on Windows, macOS, and Linux (no direct equivalent exists); requires custom implementation.
   */
  zoomOut = 'zoom-out'
}

export type BorderStyleValue =
  | 'none' // default
  | 'dotted'
  | 'dashed'
  | 'solid';

export enum CssBorderStyleValue {
  none = 'none',
  dotted = 'dotted',
  dashed = 'dashed',
  solid = 'solid'
}

export type ShadowStyle = Partial<Record<InteractionStates, number>>;

/**
 * Appearance represents style properties that are solid in nature – meaning they do not vary with
 * interaction state (rest, hover, active) nor are they influenced by responsive size or media-query
 * adjustments.
 *
 * This category includes text settings (italic, weight, decoration, transform, align), cursor
 * styles, border styles, and other properties that define the overall look rather than behavior.
 *
 * Note: Shadow properties are included in Appearance even though they may change on interaction
 * state (for example, more pronounced on hover) because a shadow doesn't necessarily represent a
 * color. Shadows are often defined by simple numeric values (blur, offset) and sometimes a color;
 * however, their dynamic behavior is specific to rendering.
 */
export interface Appearance {
  // Text
  textItalic?: TextItalic;
  textWeight?: TextWeightValue;
  textDecoration?: TextDecorationValue;
  textAlign?: TextAlignValue;
  // textTransform?: TextTransform;

  // Cursor
  // cursor?: CursorValues;

  // Border
  borderStyle?: BorderStyleValue;

  // Shadow
  shadowBlur?: ShadowStyle;
  shadowY?: ShadowStyle;
  shadowX?: ShadowStyle;
  shadowColor?: Partial<Record<InteractionStates, SingleColor>>;
}
