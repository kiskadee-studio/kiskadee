import type { InteractionStatesKeys, SingleColor } from '../palettes/palettes.types';

export type TextItalic = boolean;

// type BackgroundColor = SingleColor;

// Text Weight -------------------------------------------------------------------------------------

export type TextWeightValue =
  | 'thin' //         100
  | 'extra-light' //  200
  | 'light' //        300
  | 'normal' //       400
  | 'medium' //       500
  | 'semi-bold' //    600
  | 'bold' //         700
  | 'extra-bold' //   800
  | 'black'; //       900

export const textWeight: TextWeightValue[] = [
  'thin',
  'extra-light',
  'light',
  'normal',
  'medium',
  'semi-bold',
  'bold',
  'extra-bold',
  'black'
];

export enum CssTextWeightProperty {
  thin = '100',
  'extra-light' = '200',
  light = '300',
  normal = '400',
  medium = '500',
  'semi-bold' = '600',
  bold = '700',
  'extra-bold' = '800',
  black = '900'
}

// Text Decoration ---------------------------------------------------------------------------------

// TODO: Should "underline dotted," "overline," and "underline dotted red" be supported?
// TODO: Where is the default value defined?
export type TextDecoration =
  | 'none' // default
  | 'underline'
  | 'line-through';

export const textDecoration: TextDecoration[] = ['none', 'underline', 'line-through'];

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
  textItalic?: TextItalic;
  textWeight?: TextWeightValue;
  textDecoration?: TextDecoration;
  // textTransform?: TextTransform;
  textAlign?: TextAlign;

  // Cursor
  cursor?: Cursor;

  // Border
  borderStyle?: BorderStyleValue;

  // Shadow
  shadowBlur?: ShadowStyle;
  shadowY?: ShadowStyle;
  shadowX?: ShadowStyle;
  shadowColor?: Partial<Record<InteractionStatesKeys, SingleColor>>;
}
