- Kiskadee does not work with design systems with light or dark mode, but rather a single theme with
  support for different color palettes, which can be used to handle variations of a white label
  product or variations of light or dark mode, or both.
- The web platform is the most fragile of all, as it relies on downloading the source code at
  runtime. Therefore, the web platform is the reference platform for Kiskadee, due to the necessary
  optimizations to ensure maximum performance.
- The interaction state of an element (hover, focus, active, etc.) does not change its size, only
  its colors.
- Dimensions can be changed due to breakpoints, but not due to interaction states. However, colors
  can only be changed due to interaction states.
- The only exception to the above rule is the properties related to shadow. However, the shadow
  properties are within the "appearance" structure and not "dimensions", meaning it is possible to
  increase the size of a shadow of an element when interacting with it, but it is not possible to
  change the color of the shadow, as it is assumed that a shadow will always be black.
- The only unit of measurement and thus the standard for properties related to dimensions is the
  pixel.
- The color variant "danger" is called "error" by the Microsoft Fluent 2 design system, but this
  makes sense in the context of that design system, as the "red" color is only used in error
  messages and error inputs. However, the "danger" color variant can be used in buttons and other
  elements, and that is why it is called "danger" in the Kiskadee design system.
- The "rest" interaction state is mandatory for color properties but optional for shadows, as a
  shadow's state can be independent. For example, it is acceptable for a shadow to appear only on
  hover even if it is absent in the rest state. In contrast, a hover state for a background color
  implies that a default (rest) color is already defined.
- Choosing named font weights improves clarity and maintainability by providing semantic context: it
  enhances readability, allows easier mapping to design systems, and simplifies future adjustments.
- The ability to customize cursors has been deprioritized. Instead, each component will have a
  predefined cursor that best matches its semantic purpose and interaction model, ensuring
  consistent and appropriate cursor behavior across the design system.
