import type { ShadowSchema } from './shadow.types';

export interface EffectSchema {
  // backgroundBlur: {
  //   intensity: number;
  //   color: string;
  // },
  // resizeOnClick: {},
  // glass: {},
  shadow?: Partial<ShadowSchema>;
}
