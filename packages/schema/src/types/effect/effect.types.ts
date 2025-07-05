import type { ShadowByInteractionState } from './shadow.types';
import type { InteractionState, SolidColor } from '../palettes/palettes.types';

export interface EffectSchema {
  // backgroundBlur: {
  //   intensity: number;
  //   color: string;
  // },
  // resizeOnClick: {},
  // glass: {},
  shadow?: Partial<{
    blur: ShadowByInteractionState;
    color: Partial<Record<InteractionState, SolidColor>>;
    y: ShadowByInteractionState;
    x: ShadowByInteractionState;
  }>;
}
