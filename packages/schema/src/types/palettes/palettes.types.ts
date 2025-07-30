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
  | 'pseudoDisabled'
  | 'readOnly';

/** Mapping from interaction states to CSS pseudo-selectors (default to rest if none). */
export const InteractionStateCssPseudoSelector: Record<InteractionState, string> = {
  rest: '',
  hover: ':hover',
  pressed: ':click',
  selected: '',
  focus: ':focus',
  disabled: ':disabled',
  pseudoDisabled: '',
  readOnly: ':read-only'
};

export const classNameCssPseudoSelector = {
  hover: {
    parent: '-a', // Used to force "hover" interaction state
    child: '-b'
  },
  pressed: {
    parent: '-c', // Used to force "pressed" interaction state
    child: '-d'
  },
  selected: {
    parent: '-e',
    child: '-f'
  },
  focus: {
    parent: '-g', // Used to force "focus" interaction state
    child: '-h'
  },
  disabled: {
    // parent: '-i', // Do not necessary
    child: '-j'
  },
  pseudoDisabled: {
    parent: '-k',
    child: '-l'
  },
  readOnly: {
    parent: '-m',
    child: '-n'
  }
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
