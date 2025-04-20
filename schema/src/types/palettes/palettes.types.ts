/** Represents a hue value in degrees ranging from 0 to 360. */
type Hue = number;

/** Represents a lightness percentage ranging from 0 to 100. */
type Lightness = number;

/** Represents a saturation percentage ranging from 0 to 100. */
type Saturation = number;

/** Represents an alpha value (opacity) ranging from 0 to 1 (e.g., 0.02). */
type Alpha = number;

/** Represents a color in HLSA format: [hue, lightness, saturation, alpha]. */
type HLSA = [hue: Hue, lightness: Lightness, saturation: Saturation, alpha: Alpha];

/** Represents a single color in HLSA format. */
export type SingleColor = HLSA;

/** Represents a position value as a percentage ranging from 0 to 100. */
type Position = number;

/** Represents a degree value ranging from 0 to 360. */
type Degree = number;

/** Represents a gradient consisting of a degree and an array of color/position pairs. */
type Gradient = [Degree, [...SingleColor, Position][]];

/** Represents a color, which can either be a single color or a gradient. */
export type Color = SingleColor | Gradient;

/**
 * Defines a state color that can be directly a Color
 * or an object with a "ref" property that holds a Color.
 * (Note: The "rest" interaction state is handled separately.)
 */
export type StateColor = Color | { ref: Omit<Color, 'rest'> };

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
 *  - "pseudo-disabled" is when the element appears disabled but still responds to interactions (e.g., to trigger a validation).
 *  - "read-only" is when the user can't modify the element's value.
 */
export type InteractionStates =
  | 'rest'
  | 'hover'
  | 'pressed'
  | 'selected'
  | 'focus'
  | 'disabled'
  | 'pseudo-disabled'
  | 'readOnly';

// Mapping from our interaction state to the corresponding CSS pseudo-selector.
// If there is no equivalent (or for "pseudo-disabled"), we use the default (rest) behavior.
export const InteractionStateCssMapping: Record<InteractionStates, string> = {
  rest: '',
  hover: ':hover',
  pressed: ':click',
  selected: '',
  focus: ':focus',
  disabled: ':disabled',
  'pseudo-disabled': '',
  readOnly: ':read-only'
};

/**
 * A FullColor defines the set of colors for different interaction states.
 * The "rest" state is required and must be defined directly as a Color (not as an object with "ref").
 * The remaining interaction states are optional and can be defined as a StateColor.
 */
export type FullColor = {
  rest: Color;
} & Partial<Record<Exclude<InteractionStates, 'rest'>, StateColor>>;

/**
 * Color variant properties.
 * These keys describe the different visual usages for colors within the design system.
 *
 *  - "primary" represents the main color used for prominent elements.
 *  - "secondary" serves as a supporting color that complements the primary.
 *  - "tertiary" is used for additional emphasis or subtle accents.
 *  - "danger" indicates error states or destructive actions.
 *  - "warning" highlights cautionary statuses or alerts.
 *  - "success" conveys positive actions or states.
 *  - "info" is employed to give feedback or highlight neutral actions, often using lighter tones.
 *  - "neutral" is intended for elements with less emphasis, such as less prominent text, borders, dividers, or backgrounds.
 */
export type VariantKeys =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'neutral';

/**
 * Each variant is defined as a FullColor (an object with at least the "rest" interaction state).
 */
export type Variants = {
  [K in VariantKeys]?: FullColor;
};

/**
 * The color properties used in the design system.
 */
export type ColorKeys = 'textColor' | 'bgColor' | 'borderColor';

export enum CssColorProperty {
  textColor = 'color',
  bgColor = 'background-color',
  borderColor = 'border-color'
}

// export const colorKeys: ColorKeys[] = ['textColor', 'bgColor', 'borderColor'];

export type Palettes = Partial<Record<ColorKeys, FullColor | Variants>>;
export type PaletteKeys = keyof Palettes;
