import type { ShadowSchema } from './shadow.types';
import type { SolidColor } from '../palettes/palettes.types';

export type ElementEffects = Partial<{
  // blur: {
  //   intensity: number;
  //   color: string;
  // },
  // resizeOnClick: {},
  // glass: {},
  // reflect
  shadow: Partial<ShadowSchema>;
}>;

export type GlobalEffects = Partial<{
  focusTrail: {
    color: SolidColor;
  };
  ripple: {
    bounded: boolean;
    origin: 'center' | 'pointer';
    color: SolidColor;
  };
}>;
