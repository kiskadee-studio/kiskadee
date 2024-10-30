type Hue = number; // 0 - 360

type Lightness = number; // 0 - 100

type Saturation = number; // 0 - 100

type Alpha = number; // 0 - 1 (e.g. 0.02)

type HLSA = [hue: Hue, lightness: Lightness, saturation: Saturation, alpha: Alpha];

export type SingleColor = HLSA;

type Position = number; // 0 - 100

type Degree = number; // 0 - 360

type Gradient = [Degree, [...SingleColor, Position][]];

type ColorProperties = 'fontColor' | 'bgColor' | 'borderColor';

type ColorVariantProperties =
  // "primary" is the main color of the brand
  | 'primary'

  // "secondary" is the secondary color of the brand
  | 'secondary'

  // "tertiary" is the third color of the brand
  | 'tertiary'

  // "danger" is the color used to indicate errors or destructive actions
  | 'danger'

  // "warning" is the color used to indicate warnings or caution
  | 'warning'

  // "success" is the color used to indicate success or positive actions
  | 'success'

  // "info" is the color used to indicate information or neutral actions
  | 'info';

export type InteractionStatesProperties =
  // "rest" is the default state without any interaction
  | 'rest'

  // [Desktop] "hover" is when the user hovers over the element with a mouse
  | 'hover'

  // "pressed" is when the user presses (clicks or taps) the element
  | 'pressed'

  // "selected" is when the element is selected, checked, or activated
  | 'selected'

  // "focus" is when the element is focused
  | 'focus'

  // "disabled" is when the user can't interact with the element
  | 'disabled'

  // "read-only" is when the user can't modify the element's value
  | 'read-only';

type Color = SingleColor | Gradient;

type InteractionStates = Partial<Record<InteractionStatesProperties, Color>>;

type Variants = Partial<Record<ColorVariantProperties, Color | InteractionStates>>;

export type Palettes = Partial<Record<ColorProperties, Color | Variants>>;
