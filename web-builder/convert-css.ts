import fs from 'node:fs';

// Helper to safely format a class name
export function sanitizeClassName(value: string): string {
  // Returns an empty string for invalid inputs.
  if (!value) return '';

  return (
    value
      // Converts camelCase to snake_case.
      .replace(/([a-z])([A-Z])/g, '$1_$2')

      // Replaces non-alphanumeric characters and multiple _ with a single _.
      .replace(/[\W_]+/g, '_')

      // Converts everything to lowercase.
      .toLowerCase()

      // Removes extra underscores at the beginning and end.
      .replace(/^_+|_+$/g, '')
  );
}

// Updated CSS generation to handle property names like `fontItalic`
function convertToCSSWithShadows(styleMap: Record<string, number>): string {
  let css = '';
  const shadowGroups: Record<string, { [key: string]: string }> = {}; // Group shadow properties by class

  for (const key of Object.keys(styleMap)) {
    const [mainKey, value] = key.split('__');
    const [property, state] = mainKey.split('::'); // Split for state

    // Convert camelCase `property` to snake_case
    const translatedProperty = property.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    const sanitizedValue = sanitizeClassName(value); // Make sure the value is valid for a class name
    let className = `${translatedProperty}_${sanitizedValue}`;
    if (state) {
      className += `:${state}`; // Add pseudo-class like hover
    }

    // Handle shadows separately
    if (property.startsWith('shadow')) {
      const baseClass = `${translatedProperty}_${sanitizedValue}${state ? `:${state}` : ''}`;
      if (!shadowGroups[baseClass]) {
        shadowGroups[baseClass] = {};
      }
      shadowGroups[baseClass][property] = value;
      continue;
    }

    // Handle fontItalic property
    if (property === 'fontItalic') {
      const fontStyle = value === 'true' ? 'italic' : 'normal'; // Map true/false to valid font-style values
      css += `.${sanitizeClassName(className)} {\n  font-style: ${fontStyle};\n}\n`;
      continue;
    }

    // Handle non-shadow properties
    const cssProperty = translatedProperty; // Use the snake_case property name
    const cssValue = value?.replace(/_/g, ' ') ?? ''; // Replace underscores with spaces for CSS
    if (cssValue) {
      css += `.${sanitizeClassName(className)} {\n  ${cssProperty}: ${cssValue};\n}\n`;
    }
  }

  // Process grouped shadow properties and combine them into valid `box-shadow`
  for (const className in shadowGroups) {
    const shadowProps = shadowGroups[className];
    const shadowX = ensureUnit(shadowProps['shadowX']); // Add "px" to shadowX if missing
    const shadowY = ensureUnit(shadowProps['shadowY']); // Add "px" to shadowY if missing
    const shadowBlur = ensureUnit(shadowProps['shadowBlur']); // Add "px" to blur if missing
    const shadowColor = shadowProps['shadowColor'] ?? 'black'; // Default color to black

    // Combine all shadow values into a single `box-shadow`
    const boxShadowValue = `${shadowX} ${shadowY} ${shadowBlur} ${shadowColor}`;
    css += `.${sanitizeClassName(className)} {\n  box-shadow: ${boxShadowValue};\n}\n`;
  }

  return css;
}

// Helper to add units to numeric values
function ensureUnit(value: string | undefined, defaultUnit = 'px'): string {
  if (!value) return `0${defaultUnit}`; // Default to "0px" if value is undefined

  // Check if the value is numeric (e.g., "6", "4") – add units if it's missing
  const isNumeric = /^\d+(\.\d+)?$/.test(value);
  return isNumeric ? `${value}${defaultUnit}` : value; // Append unit to pure numbers, otherwise return as-is
}

// Example usage with the provided styleKeyValueCount
const styleKeyValueCount = {
  shadowX__2: 1,
  shadowY__4: 1,
  shadowBlur__5: 1,
  'shadowColor__rgba(0, 0, 0, 0.5)': 1,
  'shadowX::hover__6': 1,
  'shadowY::hover__8': 1,
  fontItalic__true: 1,
  fontItalic__false: 1
};

const cssContent = convertToCSSWithShadows(styleKeyValueCount);

// Write to a CSS file
fs.writeFileSync('split-shadow-styles.css', cssContent);

console.log('CSS file generated: split-shadow-styles.css');
