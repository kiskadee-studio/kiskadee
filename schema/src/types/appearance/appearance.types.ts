import type { InteractionStatesKeys, SingleColor } from '../palettes/palettes.types';

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

export type TextAlign =
  | 'left' // default
  | 'center'
  | 'right'
  | 'justify';

export const textAlign: TextAlign[] = ['left', 'center', 'right', 'justify'];

// -------------------------------------------------------------------------------------------------

// TODO: Is it really necessary?
export type Cursor =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  | 'all-scroll'
  | 'col-resize'
  | 'row-resize'
  | 'n-resize'
  | 'e-resize'
  | 's-resize'
  | 'w-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'zoom-in'
  | 'zoom-out';

export type BorderStyleValue =
  | 'none' // default
  | 'dotted'
  | 'dashed'
  | 'solid';

export enum CssBorderStyleProperty {
  none = 'none',
  dotted = 'dotted',
  dashed = 'dashed',
  solid = 'solid'
}

export type ShadowStyle = Partial<Record<InteractionStatesKeys, number>>;

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
  textItalic?: TextItalic; // Update phrase 2
  textWeight?: TextWeightValue; // Phrase 1 and 2 are OK
  textDecoration?: TextDecorationValue; // Update phrase 2
  textAlign?: TextAlign; // Update phrase 2
  // textTransform?: TextTransform;

  // Cursor
  cursor?: Cursor; // Crate phrase 2

  // Border
  borderStyle?: BorderStyleValue; // Phrase 1 and 2 are OK

  // Shadow
  shadowBlur?: ShadowStyle; // Create phrase 2
  shadowY?: ShadowStyle;
  shadowX?: ShadowStyle;
  shadowColor?: Partial<Record<InteractionStatesKeys, SingleColor>>;
}
