import type { InteractionStatesKeys, SingleColor } from '../palettes/palettes.types';

export type TextItalic = boolean;

// type BackgroundColor = SingleColor;

export type TextWeight =
  | 'thin' // 100
  | 'extra-light' // 200
  | 'light' // 300
  | 'normal' // 400
  | 'medium' // 500
  | 'semi-bold' // 600
  | 'bold' // 700
  | 'extra-bold' // 800
  | 'black'; // 900

export type TextDecoration =
  | 'none' // default
  | 'underline'
  | 'line-through';

// TODO: Is it really necessary?
export type TextTransform =
  | 'none' // default
  | 'uppercase'
  | 'lowercase'
  | 'capitalize';

export type TextAlign =
  | 'left' // default
  | 'center'
  | 'right';

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

export type BorderStyle =
  | 'none' // default
  | 'dotted'
  | 'dashed'
  | 'solid';

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
  textWeight?: TextWeight;
  textDecoration?: TextDecoration;
  textTransform?: TextTransform;
  textAlign?: TextAlign;

  // Cursor
  cursor?: Cursor;

  // Border
  borderStyle?: BorderStyle;

  // Shadow
  shadowBlur?: ShadowStyle;
  shadowY?: ShadowStyle;
  shadowX?: ShadowStyle;
  shadowColor?: Partial<Record<InteractionStatesKeys, SingleColor>>;
}
