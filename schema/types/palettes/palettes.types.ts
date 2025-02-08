type Hue = number; // 0 - 360
type Lightness = number; // 0 - 100
type Saturation = number; // 0 - 100
type Alpha = number; // 0 - 1 (e.g. 0.02)
type HLSA = [hue: Hue, lightness: Lightness, saturation: Saturation, alpha: Alpha];

export type SingleColor = HLSA;

type Position = number; // 0 - 100
type Degree = number; // 0 - 360
type Gradient = [Degree, [...SingleColor[], Position][]];

export type Color = SingleColor | Gradient;

// Utility type to require at least one property from a given set of keys
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Omit<T, Keys> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Instead of allowing a simplified version, a color must now be defined
 * in an object containing at least one interaction state property.
 * It is common to use the "rest" state, but it is not mandatory.
 */
export type FullColor = RequireAtLeastOne<Record<InteractionStatesProperties, Color>>;

/**
 * Interaction states.
 * The keys describe the various interaction states available:
 *
 *  - "rest" is the default state without any interaction
 *  - "hover" is when the user's cursor is over the element
 *  - "pressed" is when the user presses (clicks or taps) the element
 *  - "selected" is when the element is selected, checked, or activated
 *  - "focus" is when the element is focused
 *  - "disabled" is when the user can't interact with the element
 *  - "pseudo-disabled" is when the element appears disabled but still responds to interactions (e.g., to trigger a validation)
 *  - "read-only" is when the user can't modify the element's value
 */
export type InteractionStatesProperties =
  | 'rest'
  | 'hover'
  | 'pressed'
  | 'selected'
  | 'focus'
  | 'disabled'
  | 'pseudo-disabled'
  | 'read-only';

/**
 * Color variant properties.
 * These keys describe the different visual usages for colors within the design system.
 * They are intended to cover various contexts, whether it's for a product, service, or application interface.
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
export type ColorVariantProperties =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'neutral';

/**
 * Each variant is defined as a FullColor (an object with at least one
 * interaction state property).
 */
export type Variants = {
  [K in ColorVariantProperties]?: FullColor;
};

export type ParentVariants = {
  parent: Variants;
};

export type ColorProperties = 'fontColor' | 'bgColor' | 'borderColor';

/**
 * The palettes now do not allow a simplified version.
 * Each color property must be defined as an object that contains at least
 * one interaction state (e.g. "rest", "hover", etc.).
 */
export type Palettes = Partial<Record<ColorProperties, FullColor | Variants | ParentVariants>>;
