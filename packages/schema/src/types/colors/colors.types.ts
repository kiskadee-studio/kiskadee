import type { SegmentName } from '../../schema';

/** Represents a hue value in degrees ranging from 0 to 360. */
type Hue = number;

/** Represents a lightness percentage ranging from 0 to 100. */
type Lightness = number;

/** Represents a saturation percentage ranging from 0 to 100. */
type Saturation = number;

/** Represents an alpha value (opacity) ranging from 0 to 1 (e.g., 0.02). */
type Alpha = number;

/** Represents a color in HSLA format: [hue, saturation, lightness, alpha]. */
export type HSLA = [hue: Hue, saturation: Saturation, lightness: Lightness, alpha: Alpha];

/** Represents a color in hexadecimal format (e.g., "#ff0000" or "#ff0000ff"). */
export type Hex = string;

/** Represents a single solid color in HSLA format. */
export type SolidColor = HSLA;

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
export type ColorValue = Color | { ref?: Color | undefined };

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
 *    a class-based fallback (see classNameStateClassMap) to emulate or force that state (including utility classes such as the global activator).
 *  - "rest" intentionally maps to "" (no pseudo) because it is the baseline state.
 */
export const InteractionStateCssPseudoSelector: Record<InteractionState, string> = {
  rest: '',
  hover: ':hover',
  pressed: ':active',
  selected: '',
  focus: ':focus-visible',
  // Disabled no longer uses the native pseudo selector. We intentionally map it to an empty
  // string and rely on the activator class ("-a") combined with the disabled visual class
  // ("-d"; same class used for pseudoDisabled) to style the disabled state.
  // Rationale: using only the activator+class shortens selectors and keeps a single
  // activation path for both disabled and pseudoDisabled visuals.
  disabled: '',
  readOnly: ':read-only'
};

/**
 * Narrow type for the valid keys of InteractionStateCssPseudoSelector.
 * Prefer using this alias instead of repeating `keyof typeof InteractionStateCssPseudoSelector`.
 */
export type PseudoSelectorKeys = keyof typeof InteractionStateCssPseudoSelector;

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
export const stateActivator = {
  hover: '-h', // Force "hover" appearance without real pointer hover
  pressed: '-p', // Force "pressed" appearance without a real press/click
  selected: '-s', // Mark an element as selected/active
  focus: '-f', // Force focus styles without moving focus
  // Disabled use the same visual class suffix as the former pseudoDisabled ("-d").
  // We no longer keep a separate key for pseudoDisabled here; use the "disabled" entry instead.
  disabled: '-d',
  readOnly: '-r', // Force read-only visuals
  shadow: '-e', // Activation class for shadow/elevation
  activator: '-a', // Global activator class used to enable forced-state variants
  interactive: '-i' // Interactive anchor for native parent-state selectors (e.g., .-i:hover .child)
};

/**
 * Narrow type for the valid keys of stateActivator.
 * Prefer using this alias instead of repeating `keyof typeof stateActivator`.
 */
export type StateActivatorKeys = keyof typeof stateActivator;

export type SelectedInteractionState = keyof SelectedInteractionSubMap;
export type SelectedInteractionStateToken = `selected:${SelectedInteractionState}`;

/**
 * Represents how an element’s color varies across its own interaction states (e.g., rest, hover,
 * focus, disabled). Each state maps to either a direct Color definition or a ParentColor reference.
 */
// Submap for the "selected" (on) control state. It defines its own interaction variants.
// Notes:
// - Requires "rest" (on/rest) as a baseline when selected is active.
// - Allows hover/pressed/focus within the selected scope.
// - Does NOT include nested selected/disabled/readOnly to avoid combinatorial explosion;
//   disabled/readOnly remain top-level with global precedence.
export type SelectedInteractionSubMap = {
  rest?: ColorValue; // on/rest baseline when selected is active (now optional)
  hover?: ColorValue; // on/hover
  pressed?: ColorValue; // on/pressed
  focus?: ColorValue; // on/focus
};

/**
 * Represents how an element’s color varies across its own interaction states (e.g., rest, hover,
 * focus, disabled). Each state maps to either a direct Color definition or a ParentColor reference.
 * When the element supports a persistent control state (selected/on), the "selected" key contains
 * a submap with its own interaction variants.
 */
export type InteractionStateColorMap = {
  // Off scope (not selected)
  rest?: Color;
  hover?: ColorValue;
  pressed?: ColorValue;
  focus?: ColorValue;

  // On scope (selected)
  selected?: SelectedInteractionSubMap;

  // Global precedence states
  disabled?: ColorValue;
  readOnly?: ColorValue;
};

/**
 * Semantic color tokens that convey the purpose of each color.
 *
 * The "-like" suffix indicates artistic freedom: the actual hue can vary
 * (e.g., green-like could be teal, mint, emerald) while maintaining the
 * communicative intent.
 */
export type SemanticColor =
  | 'primary' // Main color for prominent elements
  | 'secondary' // Supporting color that complements primary
  | 'redLike' // Danger, negative, error
  | 'yellowLike' // Warning, attention, caution
  | 'greenLike' // Success, positive, affirmative
  // | 'cyanLike' // Info
  // | 'purpleLike' // New, alternative
  | 'neutral'; // Low-emphasis elements (text, borders, dividers, backgrounds);

/**
 * Defines a (partial) mapping from each semantic color token to its color definitions across
 * interaction states.
 */
export type EmphasisVariant = 'soft' | 'solid';

// /**
//  * Entry for a semantic color in Schema palettes: either a direct interaction-state map,
//  * or a map of emphasis variants (soft/solid), each with its own interaction-state map.
//  */
// export type SemanticColorEntry =
//   | InteractionStateColorMap
//   | Record<EmphasisVariant, InteractionStateColorMap>;

// In component ColorSchema usage, all semantic categories use emphasis variants (soft/solid).
// Primary and secondary are no longer special; every category follows the same structure.
export type SemanticColorMap = Partial<
  Record<SemanticColor, Partial<Record<EmphasisVariant, InteractionStateColorMap>>>
>;

/** Lists corresponding CSS properties for each design system color property. */
export enum CssColorProperty {
  textColor = 'color',
  boxColor = 'background-color',
  borderColor = 'border-color'
  // TODO: test it
  // iconColor = 'color'
}

/** The set of color-related properties available */
export type ColorProperty = keyof typeof CssColorProperty;

// /** List of all color properties for iteration or validation. */
// export const colorPropertyList: ColorProperty[] = ['textColor', 'boxColor', 'borderColor'];

type Prohibit<K extends PropertyKey> = { [P in K]?: never };

/**
 * Union type representing either a simple interaction-state color map or an intent-based color map
 * for more complex semantic usage.
 */
type ColorEntry =
  | (InteractionStateColorMap & Prohibit<keyof SemanticColorMap>)
  | (SemanticColorMap & Prohibit<keyof InteractionStateColorMap>);

/**
 * Represents the color schema for components, mapping each ColorProperty to either direct
 * interaction-state colors or intent-based color maps.
 */
export type ColorSchema = Partial<Record<ColorProperty, ColorEntry>>;

// -------------------------------------------------------------------------------------------------
// Color Scale System for Theme-Level Color Palettes
// -------------------------------------------------------------------------------------------------

/**
 * A complete color scale mapping tone values (0–100) to color definitions.
 * Keys are restricted to the normalized track tone sets:
 * - LightTrackTones: 0–30 (soft)
 * - DarkTrackTones: 40–100 (solid)
 */
export type ColorScale = Partial<Record<LightTrackTones | DarkTrackTones, SolidColor>>;

/**
 * Restricted tone ranges per track to avoid misuse:
 * - light: 0–30 (backgrounds/tints/subtle)
 * - dark: 40–100 (actions/solids/strong borders)
 *
 * Tone meaning and mental model:
 * - Tone numbers represent percent darkness (0 = lightest/near white, 100 = darkest/near black).
 * - A useful analogy is opacity/ink coverage: low tone values feel like low opacity/subtle coverage,
 *   therefore low darkness. For example, tones 3/5/10 work well for subtle backgrounds, borders, and tints.
 * - To communicate with HSLA, use the quick approximation: L ≈ 100 − tone.
 *   Examples: tone 5 → L≈95%; tone 30 → L≈70%; tone 100 → L≈0%.
 *
 * Note:
 * - “lightness/brightness” in HSL/HSV increases toward lighter, whereas our tone increases toward darker.
 *   That’s why the inline comments use “% darkness”.
 */
export type LightTrackTones =
  | 0 // 0% darkness
  | 1 // 1% darkness
  | 2 // 2% darkness
  | 3 // 3% darkness
  | 4 // 4% darkness
  | 5 // 5% darkness
  | 6 // 6% darkness
  | 7 // 7% darkness
  | 8 // 8% darkness
  | 9 // 9% darkness
  | 10 // 10% darkness
  | 15 // 15% darkness
  | 20 // 20% darkness
  | 25 // 25% darkness
  | 30; // 30% darkness

export type DarkTrackTones =
  | 40 // 40% darkness
  | 50 // 50% darkness
  | 60 // 60% darkness
  | 70 // 70% darkness
  | 80 // 80% darkness
  | 90 // 90% darkness
  | 100; // 100% darkness

export type ColorScaleLight = Partial<Record<LightTrackTones, SolidColor>>;
export type ColorScaleDark = Partial<Record<DarkTrackTones, SolidColor>>;

/**
 * A variant map holding a tonal ColorScale for each tone track (light/dark).
 * Note: This refers to tonal tracks, not theme mode.
 */
export type VariantColorScale = {
  light: ColorScaleLight;
  dark: ColorScaleDark;
};

// ------------------------------
// Theme Mode vs Tone Tracks
// ------------------------------
/**
 * Theme modes (context): not to be confused with tone tracks.
 * You may support an optional third mode such as deeper dark ("darker").
 */
export type ThemeMode = 'light' | 'dark' | 'darker';

/**
 * Tone tracks available inside each theme mode.
 * - soft uses 0–30 tones (subtle/surfaces)
 * - solid uses 40–100 tones (solids/strong)
 */
// ToneTracks uses `soft` and `solid` (UI emphasis terms). This refers to tonal tracks, not theme modes.
export type ToneTracks = {
  // Soft track: light tonal range (0–30) for subtle/surface backgrounds
  soft: ColorScaleLight;
  // Solid track: mid-to-dark tonal range (40–100) for solids, borders, and strong content
  solid: ColorScaleDark;
};

// /**
//  * For categories that support theme modes: each mode contains both tone tracks.
//  */
// export type ModeVariantColorScale = Record<ThemeMode, ToneTracks>;

/**
 * Complete color palette for a design system theme.
 * Maps each semantic category to its full tonal scale.
 *
 * All semantic colors are required to ensure consistency across segments
 * and enable theme automation (copying structure while changing brand colors).
 */
export type ColorPalette = Record<SemanticColor, ToneTracks>;

/**
 * Theme color palette for a specific theme mode (light, dark, darker).
 * Each theme defines its own independent color scales and tone tracks.
 */
export type ThemeColorPalette = ColorPalette;

/**
 * Segment definition containing themes.
 * A segment represents a brand/product identity (e.g., Google, YouTube, WhatsApp).
 * Each segment must define at least one theme mode.
 */
export type Segment = {
  name: string;
  themes: Partial<Record<ThemeMode, ThemeColorPalette>>;
};

/**
 * Root colors definition in the Schema.
 *
 * Supports multiple segment variants (white label brands/products).
 * Each segment contains:
 * - Brand identity colors (primary color varies by segment)
 * - Universal semantic colors (greenLike, yellowLike, redLike, neutral - consistent across segments)
 * - Multiple theme modes (light, dark, darker)
 *
 * Example structure:
 * segments: {
 *   google: {
 *     name: 'Google',
 *     themes: {
 *       light: { primary: {...}, greenLike: {...}, ... },
 *       dark: { primary: {...}, greenLike: {...}, ... }
 *     }
 *   },
 *   youtube: {
 *     name: 'YouTube',
 *     themes: {
 *       light: { primary: {...}, greenLike: {...}, ... }
 *     }
 *   }
 * }
 */
export type SchemaSegments = Record<SegmentName, Segment>;

/**
 * Element palettes for components following the same structure as SchemaSegments.
 * Maps segment names to theme modes to ColorSchema definitions.
 *
 * This structure ensures consistency between segment definitions and their usage in components.
 *
 * Example structure:
 * palettes: {
 *   ios: {
 *     light: {
 *       boxColor: { primary: { soft: { rest: [...], hover: [...] } } }
 *     },
 *     dark: {
 *       boxColor: { primary: { soft: { rest: [...], hover: [...] } } }
 *     }
 *   }
 * }
 */
export type ElementPalettes = Partial<Record<SegmentName, Partial<Record<ThemeMode, ColorSchema>>>>;
