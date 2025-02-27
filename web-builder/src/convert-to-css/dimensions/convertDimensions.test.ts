import { dimensionKeys } from '@kiskadee/schema';
// convertDimensions.additional.test.ts
import { describe, expect, it } from 'vitest';
import { convertDimensions } from './convertDimensions';

const breakpoints = {
  all: 0,
  sm1: 320,
  sm2: 360,
  sm3: 400,
  md1: 568,
  md2: 768,
  md3: 1024,
  lg1: 1152,
  lg2: 1312,
  lg3: 1792,
  lg4: 2432
};

// A local mapping of dimension keys to their expected CSS properties.
// This corresponds to the cssPropertyMap in your implementation.
const expectedProperties: Record<string, string> = {
  textSize: 'font-size',
  paddingTop: 'padding-top',
  marginLeft: 'margin-left',
  borderWidth: 'border-width',
  width: 'width',
  height: 'height'
};

describe('convertDimensions - Valid Properties', () => {
  // Loop over each valid dimension key (as provided in dimensionKeys)
  for (const dimKey of dimensionKeys) {
    // Simple conversion test without media query.
    const simpleKey = `${dimKey}--sm__16`;
    it(`should convert '${simpleKey}' into a valid CSS rule`, () => {
      const result = convertDimensions(simpleKey, breakpoints);
      expect(result).toBeTruthy();

      // Verify the class name format.
      expect(result).toContain(`.${dimKey}-sm {`);

      // Verify the converted property and unit.
      if (dimKey === 'textSize') {
        // textSize should be converted from px to rem.
        expect(result).toContain(`${expectedProperties[dimKey]}: 1rem`);
      } else {
        expect(result).toContain(`${expectedProperties[dimKey]}: 16px`);
      }
    });

    // Conversion test with a media query modifier.
    // For demonstration we use "md" as the class part and "lg1" as the breakpoint.
    const mqKey = `${dimKey}--md::lg1__32`;
    it(`should convert '${mqKey}' into a valid CSS rule wrapped in a media query`, () => {
      const result = convertDimensions(mqKey, breakpoints);
      expect(result).toBeTruthy();

      // Verify the class name format.
      expect(result).toContain(`.${dimKey}-md {`);

      // Check the property conversion.
      if (dimKey === 'textSize') {
        expect(result).toContain(`${expectedProperties[dimKey]}: 2rem`);
      } else {
        expect(result).toContain(`${expectedProperties[dimKey]}: 32px`);
      }

      // Verify that the rule is wrapped in the media query using the lg1 breakpoint.
      expect(result).toContain(`@media (min-width: ${breakpoints.lg1}px)`);
    });
  }
});

describe('convertDimensions - Exceptions', () => {
  it('should return null for a key with an invalid prefix', () => {
    const key = 'invalid--sm__10';
    const result = convertDimensions(key, breakpoints);
    expect(result).toBeNull();
  });

  it('should return null for a key missing the proper delimiter', () => {
    const key = 'width--sm-100';
    const result = convertDimensions(key, breakpoints);
    expect(result).toBeNull();
  });

  it('should return null if the dimension value is not numeric', () => {
    const key = 'borderWidth--md__abc';
    const result = convertDimensions(key, breakpoints);
    expect(result).toBeNull();
  });

  it('should return null if the media query breakpoint key is not found in breakpoints', () => {
    const key = 'height--lg::invalid__100';
    const result = convertDimensions(key, breakpoints);
    expect(result).toBeNull();
  });
});
