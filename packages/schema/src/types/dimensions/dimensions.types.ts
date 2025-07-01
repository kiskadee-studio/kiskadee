import type { BreakpointValue, ElementSizeValue } from '../../breakpoints';

export type PixelValue = number; // px

export const SCALE_PROPERTIES = [
  // Text
  'textSize',
  'textHeight',
  // Padding
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  // Margin
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  // Box
  'boxHeight',
  'boxWidth',
  // Border
  'borderWidth',
  'borderRadius'
] as const;

export type ScaleProperty = (typeof SCALE_PROPERTIES)[number];

export const scaleProperties: ScaleProperty[] = [...SCALE_PROPERTIES];

export type ScaleByBreakpoint = Partial<Record<BreakpointValue, PixelValue>>;

export type ScaleSchema = Partial<
  Record<
    ScaleProperty,
    Partial<Record<ElementSizeValue, ScaleByBreakpoint | PixelValue>> | PixelValue
  >
>;
