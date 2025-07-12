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
 * - PROPERTY_VALUE: separates property and value
 * - STATE: separates property/scale from interaction state
 * - SCALE: separates property from size (scale)
 * - BREAKPOINT: separates size (scale) from breakpoint
 * - REF_STATE: separates property from state when it’s a reference
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

  // 1) Decoration (nenhum state, nenhuma size)
  if (!interactionState && !size) {
    return `${propertyName}${SEPARATORS.PROPERTY_VALUE}${valStr}`;
  }

  // 2) Scale (size presente)
  // prop++size__value  ou  prop++size::bp__value
  if (size) {
    const bpPart = breakpoint ? `${SEPARATORS.BREAKPOINT}${breakpoint}` : '';
    return `${propertyName}${SEPARATORS.SCALE}${size}${bpPart}${SEPARATORS.PROPERTY_VALUE}${valStr}`;
  }

  // 3) Shadow / Color sem scale
  // prop--state__value  ou  prop==state__value (ref=true)
  if (isRef && interactionState !== 'rest') {
    return `${propertyName}${SEPARATORS.REF_STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valStr}`;
  }

  // default (shadow, color sem ref ou color rest):
  // prop--state__value
  return `${propertyName}${SEPARATORS.STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valStr}`;
}
