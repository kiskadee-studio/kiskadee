- Kiskadee does not work with design systems with light or dark mode, but rather a single theme 
  with support for different color palettes, which can be used to handle variations of a white 
  label product or variations of light or dark mode, or both.
- The web platform is the most fragile of all, as it relies on downloading the source code at 
  runtime. Therefore, the web platform is the reference platform for Kiskadee, due to the 
  necessary optimizations to ensure maximum performance.
- The interaction state of an element (hover, focus, active, etc.) does not change its size, only 
  its colors.
- Dimensions can be changed due to breakpoints, but not due to interaction states. However, 
  colors can only be changed due to interaction states. 
- The only exception to the above rule is the properties related to shadow. However, the shadow 
  properties are within the "appearance" structure and not "dimensions", meaning it is possible 
  to increase the size of a shadow of an element when interacting with it, but it is not 
  possible to change the color of the shadow, as it is assumed that a shadow will always be black.   