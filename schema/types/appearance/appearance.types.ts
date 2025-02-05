import type { InteractionStatesProperties, SingleColor } from '../palettes/palettes.types';

export type FontItalic = boolean;

// type BackgroundColor = SingleColor;

export type FontWeight =
  | 'thin' // 100
  | 'extra-light' // 200
  | 'light' // 300
  | 'normal' // 400
  | 'medium' // 500
  | 'semi-bold' // 600
  | 'bold' // 700
  | 'extra-bold' // 800
  | 'black'; // 900

export type FontDecoration =
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

export type ShadowStyle = Partial<Record<InteractionStatesProperties, number>>;

export type Shadow = Partial<
  Record<'shadowBlur' | 'shadowY' | 'shadowX', ShadowStyle> & {
    shadowColor: Partial<Record<InteractionStatesProperties, SingleColor>>;
  }
>;

export interface Appearance extends Shadow {
  fontItalic?: FontItalic;
  fontWeight?: FontWeight;
  textDecoration?: FontDecoration;
  textTransform?: TextTransform;
  textAlign?: TextAlign;
  cursor?: Cursor;
  borderStyle?: BorderStyle;
}
