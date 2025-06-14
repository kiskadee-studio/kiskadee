import {
  transformTextAlignKeyToCss,
  transformTextItalicKeyToCss,
  transformBorderKeyToCss,
  transformShadowKeyToCss,
  transformTextDecorationKeyToCss,
  transformTextWeightKeyToCss
} from './appearance';
import { transformDimensionKeyToCss } from './dimensions/transformDimensionKeyToCss';
import { breakpoints, dimensionKeys, schema } from '@kiskadee/schema';
import { transformColorKeyToCss } from './palettes/transformColorKeyToCss';
import { colorPropertyList } from '@kiskadee/schema';
import postcss from 'postcss';
import combineMq from 'postcss-combine-media-query';
import { convertSchemaToKeys } from '../phrase-1-convert-object-to-style-keys/convertSchemaToKeys';

/**
 * Converts a zero-based index to a token string.
 * For example, 0 -> "a", 1 -> "b", ..., 25 -> "z", 26 -> "aa", 27 -> "ab", etc.
 *
 * @param index - The zero-based index.
 * @returns The token string.
 */
export function getToken(index: number): string {
  let token = '';
  let currentIndex = index + 1; // convert to 1-indexed for easier calculation
  while (currentIndex > 0) {
    const rem = (currentIndex - 1) % 26;
    token = String.fromCharCode(97 + rem) + token;
    currentIndex = Math.floor((currentIndex - 1) / 26);
  }
  return token;
}

/**
 * Generates CSS rules from the style object by iterating just once over its keys.
 * Keys are first sorted by their numeric values (descending), then reassigned tokens.
 *
 * @param styleKeyList - The style object with keys and numeric values.
 * @returns A string containing all the generated CSS class rules.
 *
 * Expected Output (using a simple style example):
 * For an input style object:
 * {
 *   textItalic__true: 3,
 *   textAlign__center: 2,
 *   textDecoration__underline: 1
 * }
 *
 * The sorted order will be:
 *   textItalic__true -> token: "a"
 *   textAlign__center  -> token: "b"
 *   textDecoration__underline -> token: "c"
 *
 * And the expected generated CSS is:
 * .a { font-style: italic; }
 * .b { text-align: center; }
 * .c { text-decoration: underline; }
 */
export async function generateCssFromStyle(styleKeyList: Record<string, number>): Promise<string> {
  const cssRuleList: string[] = [];

  // Get an array of keys sorted by their frequency (highest first)
  // const sortedKeys = Object.keys(styleKeyList).sort();

  // // Map to store the token for each key.
  // const tokenMapping: Record<string, string> = {};
  //
  // // Assign tokens based on sorted order.
  // sortedKeys.forEach((key, index) => {
  //   tokenMapping[key] = getToken(index);
  // });

  // Iterate over the sorted keys and generate CSS rules using tokens.
  for (const styleKey of Object.keys(styleKeyList)) {
    let rule: string | undefined = undefined;

    // Appearances ---------------------------------------------------------------------------------
    if (styleKey.startsWith('borderStyle')) {
      const result = transformBorderKeyToCss(styleKey);
      rule = result.cssRule;
    } else if (styleKey.startsWith('shadow')) {
      const result = transformShadowKeyToCss(styleKey);
      rule = result.cssRule;
    } else if (styleKey.startsWith('textAlign')) {
      const result = transformTextAlignKeyToCss(styleKey);
      rule = result.cssRule;
    } else if (styleKey.startsWith('textDecoration')) {
      const result = transformTextDecorationKeyToCss(styleKey);
      rule = result.cssRule;
    } else if (styleKey.startsWith('textItalic')) {
      const result = transformTextItalicKeyToCss(styleKey);
      rule = result.cssRule;
    } else if (styleKey.startsWith('textWeight')) {
      const result = transformTextWeightKeyToCss(styleKey);
      rule = result.cssRule;
    } else if (rule === undefined) {
      // Dimensions ----------------------------------------------------------------------------------
      const matchDim = dimensionKeys.find((dim) => styleKey.startsWith(dim));
      if (matchDim) {
        const result = transformDimensionKeyToCss(styleKey, breakpoints);
        rule = result.cssRule;
      } else {
        // Pallets -------------------------------------------------------------------------------------
        const matchColor = colorPropertyList.find((color) => styleKey.startsWith(color));
        if (matchColor) {
          const result = transformColorKeyToCss(styleKey);
          rule = result.cssRule;
        }
      }
    }

    // If no rule could be generated, skip this key.
    if (!rule) {
      continue;
    }

    // Replace the original class name with the assigned token.
    // const token = tokenMapping[styleKey];
    // rule = rule.replace(new RegExp(`\\.${styleKey}\\b`), `.${token}`);
    cssRuleList.push(rule);
  }

  const rawCss = cssRuleList.sort().join('\n');
  return rawCss;

  // // Apply postcss-combine-media-query plugin to combine media queries
  // const grouped = await postcss([combineMq()]).process(rawCss, {
  //   from: undefined // avoid source file warning
  // });
  //
  // return grouped.css;
}
