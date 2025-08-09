import type {
  BreakpointValue,
  ElementSizeValue,
  InteractionState,
  StyleKey
} from '@kiskadee/schema';

export interface BuildStyleKeyParams {
  propertyName: string;
  value: unknown;
  interactionState?: InteractionState | undefined;
  isRef?: boolean | undefined;
  size?: ElementSizeValue | undefined;
  breakpoint?: BreakpointValue | undefined;
}

/**
 * Separators used when constructing style keys:
 * - PROPERTY_VALUE: separates the property and its value
 * - STATE: separates a property/scale from an interaction state
 * - SCALE: separates the property from a size (scale)
 * - BREAKPOINT: separates size (scale) from a breakpoint
 * - REF_STATE: separates the property from its state when it's a reference
 */
const SEPARATORS = {
  PROPERTY_VALUE: '__',
  STATE: '--',
  SCALE: '++',
  BREAKPOINT: '::',
  REF_STATE: '=='
};

export function buildStyleKey({
  propertyName,
  value,
  interactionState,
  isRef = false,
  size,
  breakpoint
}: BuildStyleKeyParams): StyleKey {
  const valueString =
    typeof value === 'string' || typeof value === 'number' ? String(value) : JSON.stringify(value);

  // Case 1: Base style (no interaction state or size)
  if (interactionState === undefined && size === undefined) {
    return `${propertyName}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
  }

  // Case 2: Scaled style (size provided)
  // Format: property++size__value or property++size::breakpoint__value
  if (size !== undefined) {
    const bpPart = breakpoint !== undefined ? `${SEPARATORS.BREAKPOINT}${breakpoint}` : '';
    return `${propertyName}${SEPARATORS.SCALE}${size}${bpPart}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
  }

  // Case 3: Reference style (isRef = true and state is not 'rest')
  // Format: property==state__value
  if (isRef === true && interactionState !== 'rest') {
    return `${propertyName}${SEPARATORS.REF_STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
  }

  // Default: State-based style (shadow or color without reference, or 'rest' state)
  // Format: property--state__value
  return `${propertyName}${SEPARATORS.STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
}
