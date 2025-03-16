import type { BreakpointProps, SizeProps } from '../../breakpoints';

export type DimensionValue = number; // px

// The keys representing individual CSS properties.
export type DimensionKeys =
  // Text
  | 'textSize'
  | 'textHeight'
  // Padding
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  // Margin
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
  // Box
  | 'boxHeight'
  | 'boxWidth'
  // Border
  | 'borderWidth'
  | 'borderRadius';

export const dimensionKeys: DimensionKeys[] = [
  'textSize',
  'textHeight',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'boxHeight',
  'boxWidth',
  'borderWidth',
  'borderRadius'
];

export type DimensionBreakpoints = Partial<Record<BreakpointProps, DimensionValue>>;

export type Dimensions = Partial<
  Record<
    DimensionKeys,
    Partial<Record<SizeProps, DimensionBreakpoints | DimensionValue>> | DimensionValue
  >
>;
