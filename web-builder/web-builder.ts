import type { Appearance, Shadow } from '@kiskadee/schema';

// Object to store the structure with a counter
const styleKeyValueCount: Record<string, number> = {};

// Function to process the Appearance structure
function processAppearance(appearance: Appearance) {
  // Auxiliary variables to unify shadow
  let shadowDefault = '0px--0px--0px--rgba-0-0-0-0'; // Default shadow
  let shadowHover = '0px--0px--0px--rgba-0-0-0-0'; // Hover shadow

  // Process all other properties first
  for (const [key, value] of Object.entries(appearance)) {
    if (!key.startsWith('shadow')) {
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        // Simple property (e.g.: fontItalic, fontWeight)
        const keyValue = `${key}__${value}`;
        styleKeyValueCount[keyValue] = (styleKeyValueCount[keyValue] || 0) + 1;
      } else if (typeof value === 'object' && value !== null) {
        // Object property (e.g.: values with rest/hover states)
        for (const [state, stateValue] of Object.entries(value)) {
          const prefixedKey =
            state === 'rest' // Remove the "rest" prefix
              ? `${key}__${stateValue}`
              : `${key}::${state}__${stateValue}`;
          if (typeof stateValue === 'number') {
            styleKeyValueCount[prefixedKey] = (styleKeyValueCount[prefixedKey] || 0) + 1;
          }
        }
      }
    }
  }

  // Now process the shadow-related properties
  // Generate shadowColor with a single "-" after "rgba"
  const shadowColor = Array.isArray(appearance.shadowColor)
    ? `rgba-${appearance.shadowColor.join('-')}` // Replace commas with hyphens
    : 'rgba-0-0-0-0'; // Default value

  // Variables to build shadow parts
  const defaultShadowParts: string[] = [];
  const hoverShadowParts: string[] = [];

  // Properties that compose the shadow
  const shadowProps: Array<keyof Shadow> = ['shadowBlur', 'shadowX', 'shadowY'];

  const shadow = appearance as Shadow;

  for (const prop of shadowProps) {
    const value = shadow[prop];
    if (typeof value === 'object' && value !== null) {
      // Process rest and hover states
      defaultShadowParts.push(`${value.rest ?? 0}px`);
      hoverShadowParts.push(`${value.hover ?? value.rest ?? 0}px`);
    } else {
      // Add default values if missing
      defaultShadowParts.push('0px');
      hoverShadowParts.push('0px');
    }
  }

  // Build unified shadow properties using "--"
  shadowDefault = `${defaultShadowParts.join('--')}--${shadowColor}`;
  shadowHover = `${hoverShadowParts.join('--')}--${shadowColor}`;

  // Add the unified shadow states to the counter
  styleKeyValueCount[`shadow__${shadowDefault}`] =
    (styleKeyValueCount[`shadow__${shadowDefault}`] || 0) + 1;
  styleKeyValueCount[`shadow::hover__${shadowHover}`] =
    (styleKeyValueCount[`shadow::hover__${shadowHover}`] || 0) + 1;
}

// Example usage with the `buttonAppearance` object
const buttonAppearance: Appearance = {
  fontItalic: false,
  fontWeight: 'bold',
  textDecoration: 'none',
  textTransform: 'uppercase',
  textAlign: 'center',
  cursor: 'pointer',
  borderStyle: 'solid',
  shadowColor: [0, 0, 0, 0.5], // Exception handled
  shadowBlur: { rest: 5, hover: 10 },
  shadowY: { rest: 2, hover: 4 },
  shadowX: { rest: 2, hover: 4 }
};

// Process the Appearance object multiple times to simulate repetitions
processAppearance(buttonAppearance);
processAppearance(buttonAppearance); // Repeated to test the counter
processAppearance({
  ...buttonAppearance,
  fontItalic: true // A variation to test a new entry
});

// Displaying the final structure with unified shadows
console.log(styleKeyValueCount);
