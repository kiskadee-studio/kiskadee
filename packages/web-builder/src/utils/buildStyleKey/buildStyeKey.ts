import type { BreakpointValue, ElementSizeValue, InteractionState } from '@kiskadee/schema';

export interface BuildStyleKeyParams {
  propertyName: string;
  value: unknown;
  interactionState?: InteractionState;
  isRef?: boolean;
  size?: ElementSizeValue;
  breakpoint?: BreakpointValue;
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
}: BuildStyleKeyParams): string {
  const valStr =
    typeof value === 'string' || typeof value === 'number' ? String(value) : JSON.stringify(value);

  // Case 1: Base style (no interaction state or size)
  if (!interactionState && !size) {
    return `${propertyName}${SEPARATORS.PROPERTY_VALUE}${valStr}`;
  }

  // Case 2: Scaled style (size provided)
  // Format: property++size__value or property++size::breakpoint__value
  if (size) {
    const bpPart = breakpoint ? `${SEPARATORS.BREAKPOINT}${breakpoint}` : '';
    return `${propertyName}${SEPARATORS.SCALE}${size}${bpPart}${SEPARATORS.PROPERTY_VALUE}${valStr}`;
  }

  // Case 3: Reference style (isRef = true and state is not 'rest')
  // Format: property==state__value
  if (isRef && interactionState !== 'rest') {
    return `${propertyName}${SEPARATORS.REF_STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valStr}`;
  }

  // Default: State-based style (shadow or color without reference, or 'rest' state)
  // Format: property--state__value
  return `${propertyName}${SEPARATORS.STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valStr}`;
}
