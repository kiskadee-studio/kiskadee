## 1. Color Segments, Themes, and Variations

### 1.1. Segments (Brand/Product Identity)
- Kiskadee organizes colors through **segments**, where each segment represents a distinct brand or
  product identity (e.g., Google, YouTube, WhatsApp in a multi-brand platform).
- Each segment defines its own **primary color** (brand identity color) which varies by segment,
  while maintaining universal **semantic colors** (greenLike, yellowLike, redLike, neutral) that
  remain consistent across all segments to ensure predictable component behavior and enable theme
  automation.
- For example, in a white-label e-commerce platform, one brand might use blue as its primary color
  while another uses red, but both would use the same green color for "purchase" buttons (greenLike)
  to maintain universal semantic meaning.

### 1.2. Theme Modes (Light/Dark)
- Within each segment, Kiskadee supports multiple **theme modes**: light, dark, and optionally
  darker. Each theme mode can define independent color scales and tone tracks optimized for that
  specific context.
- Theme modes allow the same segment (brand) to adapt to different display contexts while
  maintaining brand identity. For instance, Google segment might have both light and dark themes,
  each with the same blue primary hue but different tone distributions.
- Each theme must include all required semantic colors (primary, secondary, greenLike, yellowLike,
  redLike, neutral) to ensure consistency and enable automatic theme generation.

### 1.3. Universal Semantic Colors
- **primary**: Brand identity color (varies by segment - blue for Google, red for YouTube, green for
  WhatsApp)
- **secondary**: Supporting brand color (optional, varies by segment)
- **greenLike**: Universal semantic for success, purchase, confirmation, profit (always green-ish,
  ~140° hue, consistent across segments)
- **yellowLike**: Universal semantic for attention, warning, caution (always yellow-ish, ~45° hue,
  consistent across segments)
- **redLike**: Universal semantic for danger, error, urgent, notification (always red-ish, ~0° hue,
  consistent across segments)
- **neutral**: Universal semantic for text, backgrounds, borders, dividers (always grayscale,
  consistent across segments)

The "-like" suffix indicates artistic freedom: the actual hue can vary slightly while maintaining
communicative intent. This consistency enables theme automation - a "buy" button always uses
greenLike regardless of segment, ensuring it's always green even when the segment's primary color is
red or blue.

### 1.4. Performance Optimization
- For optimal web performance, each segment's theme colors are exported to separate files. When
  generating the style schema, colors are imported from the desired segment and theme.
- Build output structure: `google-light.css`, `google-dark.css`, `youtube-light.css`, etc.
- Users of one segment only download colors for that segment and active theme, avoiding unnecessary
  bundle size from other segments they'll never use.

### 1.5. Component Color Variants
- Component variants employ color variations within their theme's palette to convey distinct
  meanings. A button maintains its core structure but adapts its color to communicate purpose: red
  (redLike) for dangerous actions, green (greenLike) for confirmatory actions, brand color (primary)
  for main actions.
- These color variations create component variants without constituting a separate design system.

### 1.6. Emphasis Variants (Soft and Solid Tone Tracks)
- Kiskadee supports emphasis variants within semantic colors to provide visual hierarchy and
  flexibility. Each semantic color (primary, secondary, neutral, etc.) can define two emphasis
  tracks: **soft** (subtle, light backgrounds and tints) and **solid** (prominent, high-contrast
  fills for actions and strong visual elements).
- This dual-track system allows components to communicate different levels of visual prominence
  while maintaining semantic consistency. For example, a primary button can use solid emphasis for
  the main call-to-action, while soft emphasis works for secondary actions or backgrounds that need
  to be noticeable but not dominant.
- Components without emphasis requirements can use a **single color** (unique tone) directly under
  the semantic color, without defining soft/solid tracks. This flexibility supports simpler
  components (such as icons or dividers) that need only one color per semantic meaning, avoiding
  unnecessary complexity in the schema.

## 2. Interaction States
- The interaction state of an element (hover, focus, active, etc.) does not change its size, only
  its colors.
- Dimensions can be changed due to breakpoints, but not due to interaction states. However, colors
  can only be changed due to interaction states.
- The "rest" interaction state is mandatory for color properties but optional for shadows, as a
  shadow's state can be independent. For example, it is acceptable for a shadow to appear only on
  hover even if it is absent in the rest state. In contrast, a hover state for a background color
  implies that a default (rest) color is already defined.
- The first element/layer of a component will serve as the component’s reference for interaction  
  states triggered through the parent element, such as hover, disabled, etc.

### 2.1 Disabled visuals and aria-disabled
- For aria-disabled to work properly, use it together with status "disabled"; this ensures the 
  expected visual result.

### 2.2 Mandatory hover, focus, and pressed
- Kiskadee components MUST support the core interaction states: hover, focus, and pressed (active) in addition to rest — even when the upstream design system (DS) being adapted does not explicitly define them (common in mobile-first DSs like iOS and Material).
- Rationale (cross‑platform): Kiskadee is cross‑platform. A mobile‑oriented DS adapted via Kiskadee can be used on the web and desktop where hover and richer focus/pressed feedback are expected. Therefore, these states are mandatory for consistency and usability across platforms.
- Visual identity preservation: When adding these states to a DS that doesn’t define them, Kiskadee selects color tones that best match the DS’s visual identity so that the new states feel native rather than an afterthought.
  - Guidance for color selection:
    - Start from the component’s rest tone and choose nearby tones within the same semantic track (soft/solid) to express the state.
    - Prefer subtle luminance and/or chroma shifts over hue shifts to preserve brand hue.
    - Maintain accessible contrast in each state. If the original palette can’t reach contrast, see Section 11 for variant strategy.
- Defaults and inheritance:
  - Rest is the source of truth; hover/focus/pressed inherit from rest unless explicitly overridden.
  - Size and layout never change due to interaction state (see 2.); only color and visual effects may change.
- Focus behavior details: Input elements use :focus; interactive controls (e.g., buttons) use :focus-visible for keyboard and similar navigation (see Section 7). Visuals for focus are mandatory; implementation may use outlines, glows, or designated focus effects.
- Pressed vs active: “Pressed” refers to the visual state while the control is being activated. Map to :active (web) and the equivalent on other platforms.
- Hover triggers: Hover visual is only applied on platforms/devices that support hover. It must not affect touch-only environments.

## 3. Dimensions and Units
- The only unit of measurement and thus the standard for properties related to dimensions is the
  pixel.

## 4. Shadows and Visual Effects
- The only exception to the above rule is the properties related to shadow. However, the shadow
  properties are within the "appearance" structure and not "dimensions", meaning it is possible to
  increase the size of a shadow of an element when interacting with it, but it is not possible to
  change the color of the shadow, as it is assumed that a shadow will always be black.
- Only block elements can have shadows. Unlike the "palettes" structure that supports referencing a
  parent element to trigger state changes, shadows must be placed on the parent element itself, such
  as a card or button. If scenarios arise that require this rule to change, it can be reviewed, but
  until then this remains as a rule.
- Shadow was already part of appearance, but it became clearer that shadow is an effect, just like
  a blurred background or glass effect.
- There are global effects like Ripple and Focus as well as element-level effects like Shadow.
  However, shadows are often only applied to the container element (for example, a card) and not to
  its internal elements. Future consideration: assess whether shadow should be moved to component-
  level configuration instead of element-level to better support container shadows.


## 5. Typography
- Choosing named font weights improves clarity and maintainability by providing semantic context: it
  enhances readability, allows easier mapping to design systems, and simplifies future adjustments.
- The absence of italic indicates that the text is rendered as normal. This means that, in both
  Kiskadee and the majority (if not all) of platforms, a text is presented in its regular style with
  the optional alternative of being italicized. With this in mind, to optimize performance, Kiskadee
  does not apply any styling for normal text as it is the default; it only applies styling when
  italic formatting is required.
- Although it is possible to manage text transformation (uppercase, lowercase, capitalized), it was
  decided that components should only reflect the values inserted into them. This means if a button
  needs uppercase letters, it should be written explicitly that way. If in the future we notice that
  there are design systems that frequently use entirely uppercase or lowercase letters as a
  mandatory design rule, we can revisit this decision.

## 6. Cursor Behavior
- The ability to customize cursors has been deprioritized. Instead, each component will have a
  predefined cursor that best matches its semantic purpose and interaction model, ensuring
  consistent and appropriate cursor behavior across the design system.

## 7. Focus and Accessibility
- Focus Behavior: We opt for using `:focus` on input elements to consistently indicate when a field
  is active, ensuring clarity during text entry. Conversely, `:focus-visible` is applied to
  interactive elements like buttons to restrict the focus outline to cases of keyboard (or similar)
  navigation. This choice minimizes visual noise during mouse interactions while maintaining strong
  accessibility cues where they are most needed.

## 8. Platform and Performance
- The web platform is the most fragile of all, as it relies on downloading the source code at
  runtime. Therefore, the web platform is the reference platform for Kiskadee, due to the necessary
  optimizations to ensure maximum performance.

## 9. Naming Conventions
- All style properties must begin with the name of the object they modify. For example, 
  `borderColor` refers to the color of the border. However, not all properties typically include the 
  object in their name, such as `height`, `width`, or even `background`. To standardize these names,
  we use the concept of the "box." Standalone properties thus become `boxHeight`, `boxWidth`, and
  `boxColor` (`background-color`). Terms related to text and fonts are standardized as well: instead
  of `fontName` or simply `Color`, we prefix them with `text`, resulting in `textFont`, 
  `textDecoration`, and `textColor`.

## 10. Default Properties
The default size for elements and consequently components is medium, as is the font size, which is
16px. The default interaction state is rest, and all other interaction states inherit the style from
the rest state. The default semantic color is "neutral". The default text alignment is left.

## 11. Design System Adaptation Levels
- Purpose: Provide a clear separation between what is an upstream/original design system configuration and what is a Kiskadee-optimized variant that introduces broader semantics or additional interaction behaviors.

### 11.1 Naming and positioning
- Use explicit naming to communicate provenance:
  - Example (original fidelity): "Material Design 3 by Google" — faithful adaptation of the official DS within Kiskadee’s schema.
  - Example (Kiskadee variant): "Material Design 3 by Kiskadee" — includes broader semantic coverage, additional interaction effects, and other pragmatic adjustments to work cross‑platform.
- The goal is transparency: users can choose the original‑fidelity option or the enhanced Kiskadee variant.

### 11.2 When to create a Kiskadee variant
- The upstream DS has limited color variation or lacks explicit interaction states and this materially harms usability or accessibility on the web/desktop.
- Additional semantics are needed (e.g., more granular neutral scale or richer green/yellow/red tracks) to support component variants and accessibility.
- Extra visual effects are beneficial (e.g., hover/pressed/focus expansions, subtle elevation or focus effects) that stay true to the DS’s spirit but are not formally defined.

### 11.3 Principles for adapting visuals
- Preserve identity: Prefer changes in tone (luminance/chroma) over hue shifts; keep brand hue stable.
- Accessibility: Ensure adequate contrast for text/icons in all states (rest, hover, focus, pressed, disabled). If the original palette cannot achieve this, Kiskadee variant may expand tones.
- Consistency: Maintain semantic mapping (primary, secondary, greenLike, yellowLike, redLike, neutral) and use the soft/solid emphasis tracks when present.
- Non‑dimensional: Interaction states must not change size/layout; only color and effects may vary.

### 11.4 Required interaction support
- Regardless of the upstream DS, both the original‑fidelity and the Kiskadee variant MUST support hover, focus, and pressed states in addition to rest. See Section 2.2 for details.
- Hover must be conditional to devices that support it (no visual changes on touch‑only interactions).

### 11.5 Documentation and metadata
- Each adapted DS must document:
  - Which tones are used for rest/hover/focus/pressed for key components and how they were derived.
  - Any semantic expansions or added tracks compared to the upstream DS.
  - Any added effects (e.g., focus ring, ripple) and their triggers.
- Build outputs should keep segments/themes separated for performance (see Section 1.4).

### 11.6 Versioning and compatibility
- Track upstream DS version and Kiskadee variant version independently so consumers can pin either.
- Changes that alter palettes, semantics, or interaction visuals require a minor (visual) or major (breaking) bump depending on impact.
