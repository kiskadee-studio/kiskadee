import type { SolidColor } from '../colors/colors.types';
import type { BorderRadiusEffectSchema } from './border-radius/border-radius.types';
import type { ShadowSchema } from './shadow/shadow.types';

export type ElementEffects = Partial<{
  // blur: {
  //   intensity: number;
  //   color: string;
  // },
  // resizeOnClick: {},
  // glass: {},
  // reflect
  shadow: Partial<ShadowSchema>;
  // NEW: dynamic border-radius effect with interaction states and selected support
  borderRadius: BorderRadiusEffectSchema;
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
