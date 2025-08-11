import type {
  BreakpointValue,
  ElementSizeValue,
  InteractionState,
  StyleKey
} from '@kiskadee/schema';

export interface BuildStyleKeyParams {
  /**
   * CSS property name (e.g. "margin", "color", "shadow").
   */
  propertyName: string;

  /**
   * Value to be encoded into the key. Primitive values are stringified;
   * non-primitives are JSON-stringified.
   */
  value: unknown;

  /**
   * Optional interaction state (e.g., "rest", "hover", "focus", etc.).
   * Required when isRef is true (and must not be "rest").
   */
  interactionState?: InteractionState | undefined;

  /**
   * Whether this key is a "reference" variant. When true, a non-"rest"
   * interactionState must be provided; otherwise an error is thrown.
   */
  isRef?: boolean | undefined;

  /**
   * Optional size/scale identifier (e.g., "s:md:1", "s:lg:1").
   */
  size?: ElementSizeValue | undefined;

  /**
   * Optional responsive breakpoint (e.g., "bp:sm:1").
   * Only used in combination with size.
   */
  breakpoint?: BreakpointValue | undefined;
}

/**
 * Delimiters used to construct a unique style key string:
 *
 * - PROPERTY_VALUE: separates the property name from its value
 * - STATE: appends an interaction state to the property
 * - SCALE: appends a size/scale identifier to the property
 * - BREAKPOINT: appends a responsive breakpoint to the size
 * - REF_STATE: appends a non-rest interaction state when it's a reference
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
 *   - optional size/scale (+ optional breakpoint)
 *   - property value (primitive stringified, non-primitive JSON stringified)
 *
 * Examples:
 *   - "margin__16"                          (base value)
 *   - "margin++small__16"                   (with scale)
 *   - "margin++small::md__16"               (with scale + breakpoint)
 *   - "color==hover__\"#ff0000\""           (reference color on hover)
 *   - "shadow--focus__[4,4,8,[0,0,0,0.5]]"  (shadow values on focus)
 *
 * Notes:
 *   - When size is provided, interactionState and isRef are ignored for key construction.
 *   - When isRef is true, interactionState must be provided and cannot be "rest",
 *     otherwise an error is thrown.
 *
 * @param propertyName     CSS property name (e.g. "margin", "color", "shadow")
 * @param value            Raw or serializable value
 * @param interactionState Interaction state (e.g., "rest", "hover", "focus")
 * @param isRef            Indicates a reference key; requires non-"rest" interactionState
 * @param size             Scale identifier (e.g., "s:md:1", "s:lg:1")
 * @param breakpoint       Breakpoint identifier (e.g., "bp:sm:1")
 * @returns A unique style key string
 * @throws If isRef is true without a non-"rest" interactionState
 */
export function buildStyleKey({
  propertyName,
  value,
  interactionState,
  isRef = false,
  size,
  breakpoint
}: BuildStyleKeyParams): StyleKey {
  // Stringify the value: primitives via String(value), others via JSON.stringify
  const valueString =
    typeof value === 'string' || typeof value === 'number' ? String(value) : JSON.stringify(value);

  // 1) Size/scale branch
  //    Formats:
  //      - property++size__value
  //      - property++size::breakpoint__value (when breakpoint provided)
  if (size !== undefined) {
    const bpSuffix = breakpoint !== undefined ? `${SEPARATORS.BREAKPOINT}${breakpoint}` : '';
    return `${propertyName}${SEPARATORS.SCALE}${size}${bpSuffix}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
  }

  // 2) Reference branch
  //    Format: property==state__value
  //    Requires: isRef===true and interactionState !== undefined and !== 'rest'
  if (isRef === true && interactionState !== undefined && interactionState !== 'rest') {
    return `${propertyName}${SEPARATORS.REF_STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
  }

  // 3) Invalid reference combination
  if (isRef === true) {
    throw new Error(`buildStyleKey: when isRef=true you must supply a non-'rest' interactionState`);
  }

  // 4) Non-reference state branch
  //    Format: property--state__value
  if (interactionState !== undefined) {
    return `${propertyName}${SEPARATORS.STATE}${interactionState}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
  }

  // 5) Base case (no state, no scale, non-ref)
  //    Format: property__value
  return `${propertyName}${SEPARATORS.PROPERTY_VALUE}${valueString}`;
}
