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

type ParentColor = { ref: Omit<Color, 'rest'> };

export type ColorOrRef = Color | ParentColor;

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
export type InteractionState =
  | 'rest'
  | 'hover'
  | 'pressed'
  | 'selected'
  | 'focus'
  | 'disabled'
  | 'pseudoDisabled'
  | 'readOnly';

// Mapping from our interaction state to the corresponding CSS pseudo-selector.
// If there is no equivalent (or for "pseudo-disabled"), we use the default (rest) behavior.
export const InteractionStateCssMapping: Record<InteractionState, string> = {
  rest: '',
  hover: ':hover',
  pressed: ':click',
  selected: '',
  focus: ':focus',
  disabled: ':disabled',
  pseudoDisabled: '',
  readOnly: ':read-only'
};

export type InteractionStateColorMap = {
  rest: Color;
} & Partial<Record<Exclude<InteractionState, 'rest'>, ColorOrRef>>;

/**
 * Color intent tokens.
 * These semantic names are widely adopted in UI design systems to convey the purpose of each color:
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
export type IntentColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'neutral';

export type IntentColorMap = {
  [K in IntentColor]?: InteractionStateColorMap;
};

/**
 * The color properties used in the design system.
 */
export type ColorProperty = 'textColor' | 'bgColor' | 'borderColor';

export const colorPropertyList: ColorProperty[] = ['textColor', 'bgColor', 'borderColor'];

export enum CssColorProperty {
  textColor = 'color',
  bgColor = 'background-color',
  borderColor = 'border-color'
}

type InteractionStateOrIntentColorMap = InteractionStateColorMap | IntentColorMap;

export type Palettes = Partial<Record<ColorProperty, InteractionStateOrIntentColorMap>>;
export type PaletteKey = keyof Palettes;
