/** Represents a hue value in degrees ranging from 0 to 360. */
type Hue = number;

/** Represents a lightness percentage ranging from 0 to 100. */
type Lightness = number;

/** Represents a saturation percentage ranging from 0 to 100. */
type Saturation = number;

/** Represents an alpha value (opacity) ranging from 0 to 1 (e.g., 0.02). */
type Alpha = number;

/** Represents a color in HLSA format: [hue, lightness, saturation, alpha]. */
export type HLSA = [hue: Hue, lightness: Lightness, saturation: Saturation, alpha: Alpha];

/** Represents a color in hexadecimal format (e.g., "#ff0000" or "#ff0000ff"). */
export type Hex = string;

/** Represents a single solid color in HLSA format. */
export type SolidColor = HLSA;

/** Represents the position of a color stop in a CSS gradient as a percentage (0–100). */
type GradientStopPosition = number;

/** Represents a gradient angle in degrees (0–360). */
type GradientAngle = number;

/**
 * Represents a gradient defined by an angle and a series of color stops.
 * Each stop is a tuple of [hue, lightness, saturation, alpha, position].
 */
type Gradient = [GradientAngle, [...SolidColor, GradientStopPosition][]];

/** Represents a color, which can be either a solid color or a gradient definition. */
export type Color = SolidColor | Gradient;

/**
 * A color value that can be either:
 *  - a direct Color definition (applied in the element’s own state)
 *  - a ParentColor reference (applied only when the parent’s interaction state is inherited)
 */
export type ColorValue = Color | { ref: Color };

/**
 * Interaction states.
 * The keys describe the various interaction states available:
 *
 *  - "rest" is the default state without any interaction.
 *  - "hover" is when the user's cursor is over the element.
 *  - "pressed" is when the user presses (clicks or taps) the element.
 *  - "selected" is when the element is selected, checked, or activated.
 *  - "focus" is when the element is focused.
 *  - "disabled" is when the user can't interact with the element.
 *  - "pseudo-disabled" is when the element appears disabled but still responds to interactions (e.g.,
 *      to trigger a validation).
 *  - "read-only" is when the user can't modify the element's value.
 */
export type InteractionState =
  | 'rest'
  | 'hover'
  | 'pressed'
  | 'selected'
  | 'focus'
  | 'disabled'
  | 'readOnly';

/**
 * Map each InteractionState to the browser CSS pseudo-selector that represents it.
 *
 * How to read this mapping:
 *  - If a state has a native CSS pseudo-selector, map to that selector (e.g., ":hover", ":focus").
 *  - If a state has no native selector, map to an empty string (""). The generator will then rely on
 *    a class-based fallback (see classNameCssPseudoSelector) to emulate or force that state.
 *  - "rest" intentionally maps to "" (no pseudo) because it is the baseline state.
 */
export const InteractionStateCssPseudoSelector: Record<InteractionState, string> = {
  rest: '',
  hover: ':hover',
  pressed: ':click',
  selected: '',
  focus: ':focus',
  // Disabled no longer uses the native pseudo selector. We intentionally map it to an empty
  // string and rely on the activator class ("-a") combined with the disabled visual class
  // ("-d"; same class used for pseudoDisabled) to style the disabled state.
  // Rationale: using only the activator+class shortens selectors and keeps a single
  // activation path for both disabled and pseudoDisabled visuals.
  disabled: '',
  readOnly: ':read-only'
};

/**
 * Class suffixes used to force or emulate interaction states when:
 *  1) the state has no native CSS pseudo-selector, or
 *  2) you need to visually force a state (e.g., in a preview, during tests, or for a parent-driven
 *     state), regardless of actual user interaction.
 *
 * Usage model:
 *  - Apply the suffix to a container or control element according to your renderer’s convention
 *    (e.g., ".-h.container" to indicate “force hover” for its children).
 *  - Your CSS generation may combine the container class with child selectors to activate styles.
 *
 * Note:
 *  - For native states (hover, focus, disabled, readOnly), you generally don't need these suffixes
 *    unless you want to force the state visually.
 *  - For custom or contextual states (pseudoDisabled, selected), use these suffixes to trigger the
 *    desired styles.
 */
export const classNameCssPseudoSelector = {
  hover: '-h', // Force "hover" appearance without real pointer hover
  pressed: '-p', // Force "pressed" appearance without a real press/click
  selected: '-s', // Mark an element as selected/active
  focus: '-f', // Force focus styles without moving focus
  // Disabled uses the same visual class suffix as the former pseudoDisabled ("-d").
  // We no longer keep a separate key for pseudoDisabled here; use the "disabled" entry instead.
  disabled: '-d',
  readOnly: '-r' // Force read-only visuals
};

/**
 * Represents how an element’s color varies across its own interaction states (e.g., rest, hover,
 * focus, disabled). Each state maps to either a direct Color definition or a ParentColor reference.
 */
export type InteractionStateColorMap = {
  rest: Color;
} & Partial<Record<Exclude<InteractionState, 'rest'>, ColorValue>>;

// TODO: add a new layer of semantic colors
/**
 * Semantic color tokens that convey the purpose of each color:
 *
 *  - "primary" represents the main color used for prominent elements.
 *  - "secondary" serves as a supporting color that complements the primary.
 *  - "tertiary" is used for additional emphasis or subtle accents.
 *  - "danger" indicates error states or destructive actions.
 *  - "warning" highlights cautionary statuses or alerts.
 *  - "success" conveys positive actions or states.
 *  - "info" is used to give feedback or highlight neutral actions, often using lighter tones.
 *  - "neutral" is intended for elements with less emphasis, such as less prominent text, borders,
 *    dividers, or backgrounds.
 */
export type SemanticColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'neutral';

/**
 * Defines a (partial) mapping from each semantic color token to its color definitions across
 * interaction states.
 */
export type SemanticColorMap = {
  [K in SemanticColor]?: InteractionStateColorMap;
};

/** Enumerates corresponding CSS properties for each design system color property. */
export enum CssColorProperty {
  textColor = 'color',
  boxColor = 'background-color',
  borderColor = 'border-color',
  // TODO: test it
  iconColor = 'color'
}

/** The set of color-related properties available */
export type ColorProperty = keyof typeof CssColorProperty;

/** List of all color properties for iteration or validation. */
export const colorPropertyList: ColorProperty[] = ['textColor', 'boxColor', 'borderColor'];

/**
 * Union type representing either a simple interaction-state color map or an intent-based color map
 * for more complex semantic usage.
 */
type ColorEntry = InteractionStateColorMap | SemanticColorMap;

/**
 * Represents the color schema for components, mapping each ColorProperty to either direct
 * interaction-state colors or intent-based color maps.
 */
export type ColorSchema = Partial<Record<ColorProperty, ColorEntry>>;
