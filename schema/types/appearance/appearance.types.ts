import type { InteractionStatesProperties, SingleColor } from '../palettes/palettes.types';

type FontItalic = boolean;

// type BackgroundColor = SingleColor;

type FontWeight =
  | 'thin' // 100
  | 'extra-light' // 200
  | 'light' // 300
  | 'normal' // 400
  | 'medium' // 500
  | 'semi-bold' // 600
  | 'bold' // 700
  | 'extra-bold' // 800
  | 'black'; // 900

type FontDecoration =
  | 'none' // default
  | 'underline'
  | 'line-through';

// TODO: Is it really necessary?
type TextTransform =
  | 'none' // default
  | 'uppercase'
  | 'lowercase'
  | 'capitalize';

type TextAlign =
  | 'left' // default
  | 'center'
  | 'right';

// TODO: Is it really necessary?
type Cursor =
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

type BorderStyle =
  | 'none' // default
  | 'dotted'
  | 'dashed'
  | 'solid';

export type ShadowStyle = Partial<Record<InteractionStatesProperties, number>>;

export type Shadow = Record<'shadowBlur' | 'shadowY' | 'shadowX', ShadowStyle>;

export interface Appearance extends Shadow {
  fontItalic: FontItalic;
  fontWeight: FontWeight;
  textDecoration: FontDecoration;
  textTransform: TextTransform;
  textAlign: TextAlign;
  cursor: Cursor;
  borderStyle: BorderStyle;
  shadowColor: SingleColor;
}
