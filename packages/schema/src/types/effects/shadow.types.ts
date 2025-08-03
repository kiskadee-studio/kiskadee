import type { InteractionState, SolidColor } from '../palettes/palettes.types';
import type { PixelValue } from '../scales/scales.types';

/** Represents a shadow property that can have different numeric values for various interaction states. */
export type ShadowByInteractionState = Partial<Record<InteractionState, PixelValue>>;

export type ShadowSchema = Partial<{
  blur: ShadowByInteractionState;
  color: Partial<Record<InteractionState, SolidColor>>;
  y: ShadowByInteractionState;
  x: ShadowByInteractionState;
}>;
