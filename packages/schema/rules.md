## 1. Color Themes and Variations
- Kiskadee does not work with design systems with light or dark mode, but rather a single theme with
  support for different color palettes, which can be used to handle variations of a white label
  product or variations of light or dark mode, or both.
- Component variants employ color variations within a unified palette to convey distinct meanings.
  Consider a button that maintains its core structure - dimensions and visual style - but adapts its
  color to communicate purpose: red for dangerous actions requiring caution, green for confirmatory
  actions. These color variations create component variants without constituting a separate theme or
  design system.
- The color variant "danger" is called "error" by the Microsoft Fluent 2 design system, but this
  makes sense in the context of that design system, as the "red" color is only used in error
  messages and error inputs. However, the "danger" color variant can be used in buttons and other
  elements, and that is why it is called "danger" in the Kiskadee design system.
- For optimization purposes, a visual identity's colors are exported to a separate file, aligning
  with Kiskadee's emphasis on maximum web performance. When generating the style schema, colors must
  be imported from the desired palette or theme variant. For instance, consider a white-label
  e-commerce platform where one brand uses blue and another uses red, while sharing the same visual
  identity structure. With Kiskadee, you only need one visual identity with two defined palettes -
  one for each store. The colors from each palette are extracted separately for optimal performance.
  Since users of one store are typically unaware of the shared codebase with another store, it would
  be inefficient for users of the red-themed store to download blue-themed store colors they'll
  never use.

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

### 2.1 Pseudo Disabled (pseudoDisabled)
- Not an InteractionState: pseudoDisabled is not a first‑class interaction state. It only reuses the
  visual style of “disabled”.
- Visual: identical to disabled.
- Activation: there is no native CSS selector for a “fake disabled”. Use the forced classes
  "-d" (disabled) together with the activator "-a" on the element (e.g., `.button.-d.-a`).
- CSS reuse: any rule generated for `disabled` also applies when you add `-d` + `-a` (including
  parent‑reference cases).
- Accessibility: when visually pseudo disabled, set `aria-disabled="true"` (do not set the `disabled`
  attribute) so the control can remain focusable/clickable if needed while announcing the state to AT.

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

Existem efeitos globais como Ripple e Focus assim como efeitos a nível de elementos como Shadow, porém há a change de sombras não serem de fato usadas dentro de um elemento container, exemplo, um componente card, isto é, a sombra fica no card e os elementos internos ficam sem sombra. Se isso for caso de uso frequente, talvez seja melhor configurar a sombra a nível de componente e não nível de elemento.
