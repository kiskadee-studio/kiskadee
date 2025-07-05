import type { InteractionState } from '../palettes/palettes.types';
import type { PixelValue } from '../dimensions/dimensions.types';

/** Represents a shadow property that can have different numeric values for various interaction states. */
export type ShadowByInteractionState = Partial<Record<InteractionState, PixelValue>>;
