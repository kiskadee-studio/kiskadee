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
 * Delimiters used to construct a unique style key string:
 *
 * - PROPERTY_VALUE: separates the property name from its value
 * - STATE: appends an interaction state to the property
 * - SCALE: appends a size/scale identifier to the property
 * - BREAKPOINT: appends a responsive breakpoint to the size
 * - REF_STATE: appends an interaction state when it's a reference
 */
const SEPARATORS = {
  PROPERTY_VALUE: '__',
  STATE: '--',
  SCALE: '++',
  BREAKPOINT: '::',
  REF_STATE: '=='
};

/**
 * Builds a single style key string representing a combination of:
 *   - CSS property name
 *   - optional interaction state (hover, focus, etc.)
 *   - optional size/scale
 *   - optional breakpoint
 *   - property value (stringified)
 *
 * Examples:
 *   - "margin__16"                          (simple value)
 *   - "margin++small__16"                   (with scale)
 *   - "margin++small::md__16"               (with scale + breakpoint)
 *   - "color==hover__\"#ff0000\""           (reference color on hover)
 *   - "shadow--focus__[4,4,8,[0,0,0,0.5]]"  (shadow values on focus)
 *
 * @param propertyName     CSS property name (e.g. "margin", "color", "shadow")
 * @param value            Raw or serializable value
 * @param interactionState Interaction state (hover, rest, etc.)
 * @param isRef            Whether this is a reference (e.g. inherited color)
 * @param size             Scale identifier (e.g. "small", "large")
 * @param breakpoint       Breakpoint identifier (e.g. "sm", "md")
 * @returns A unique style key string
 */
export function buildStyleKey({
  propertyName,
  value,
  interactionState,
  isRef = false,
  size,
  breakpoint
}: BuildStyleKeyParams): StyleKey {
  // Stringify the value: primitive or JSON
  const valueString =
    typeof value === 'string' || typeof value === 'number' ? String(value) : JSON.stringify(value);

  // 1) Base case: no state, no scale
  if (interactionState === undefined && size === undefined) {
    return `${propertyName}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
  }

  // 2) With scale
  //    Format: property++size__value
  //    Or:     property++size::breakpoint__value
  if (size !== undefined) {
    const bpSuffix = breakpoint !== undefined ? `${SEPARATORS.BREAKPOINT}${breakpoint}` : '';
    return `${propertyName}${SEPARATORS.SCALE}${size}${bpSuffix}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
  }

  // 3) Reference style (isRef && state ≠ rest)
  //    Format: property==state__value
  if (isRef === true && interactionState === undefined && interactionState !== 'rest') {
    return `${propertyName}${SEPARATORS.REF_STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
  }

  // 4) State-based default (shadow, color, etc.)
  //    Format: property--state__value
  return `${propertyName}${SEPARATORS.STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
}
