import type { Appearance, Shadow } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

// Function to process the entire Appearance structure
export function processAppearance(appearance: Appearance) {
  // Auxiliary variables to unify shadow
  let shadowDefault = '';
  let shadowHover = '';

  // Process all other properties first
  for (const [key, value] of Object.entries(appearance)) {
    if (!key.startsWith('shadow')) {
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        // Simple property (e.g.: fontItalic, fontWeight)
        const keyValue = `${key}__${value}`;
        styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
      } else if (typeof value === 'object' && value !== null) {
        // Object property (e.g.: values with rest/hover states)
        for (const [state, stateValue] of Object.entries(value)) {
          const prefixedKey =
            state === 'rest' // Remove the "rest" prefix
              ? `${key}__${stateValue}`
              : `${key}::${state}__${stateValue}`;
          if (typeof stateValue === 'number') {
            styleUsageMap[prefixedKey] = (styleUsageMap[prefixedKey] || 0) + 1;
          }
        }
      }
    }
  }

  // Check if any shadow property is present
  const shadowProvided = ['shadowColor', 'shadowX', 'shadowY', 'shadowBlur'].some(
    (prop) => prop in appearance
  );

  // Process shadows only if any shadow-related property is provided
  if (shadowProvided) {
    // Generate shadowColor string with a single "-" after "rgba"
    const shadowColor = Array.isArray(appearance.shadowColor)
      ? `rgba-${appearance.shadowColor.join('-')}` // Replace commas with hyphens
      : 'rgba-0-0-0-0'; // Default value

    // Variables to build shadow parts
    const defaultShadowParts: string[] = [];
    const hoverShadowParts: string[] = [];

    // Properties that compose the shadow
    const shadowProps: Array<keyof Shadow> = ['shadowX', 'shadowY', 'shadowBlur'];

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
    const shadowRestKey = `shadow__${shadowDefault}`;
    const shadowHoverKey = `shadow::hover__${shadowHover}`;
    styleUsageMap[shadowRestKey] = (styleUsageMap[shadowRestKey] || 0) + 1;
    styleUsageMap[shadowHoverKey] = (styleUsageMap[shadowHoverKey] || 0) + 1;
  }
}
