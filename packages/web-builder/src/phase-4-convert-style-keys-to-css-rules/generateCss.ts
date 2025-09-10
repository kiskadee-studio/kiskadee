import {
  transformBorderKeyToCss,
  transformShadowKeyToCss,
  transformTextAlignKeyToCss,
  transformTextItalicKeyToCss,
  transformTextLineTypeKeyToCss,
  transformTextWeightKeyToCss
} from './appearance';
import { transformDimensionKeyToCss } from './dimensions/transformDimensionKeyToCss';
import {
  breakpoints,
  type ColorProperty,
  CssColorProperty,
  scaleProperties
} from '@kiskadee/schema';
import { transformColorKeyToCss } from './palettes/transformColorKeyToCss';
import type { GeneratedCss } from './phrase2.types';
import { transformScaleKeyToCss } from './scales/transformScaleKeyToCss';

export function generateCssRuleFromStyleKey(styleKey: string): GeneratedCss {
  let generatedCss: GeneratedCss | undefined = undefined;

  // Appearances ---------------------------------------------------------------------------------
  if (styleKey.startsWith('borderStyle')) {
    generatedCss = transformBorderKeyToCss(styleKey);
  } else if (styleKey.startsWith('shadow')) {
    generatedCss = transformShadowKeyToCss(styleKey);
  } else if (styleKey.startsWith('textAlign')) {
    generatedCss = transformTextAlignKeyToCss(styleKey, className);
  } else if (styleKey.startsWith('textLineType')) {
    generatedCss = transformTextLineTypeKeyToCss(styleKey, className);
  } else if (styleKey.startsWith('textItalic')) {
    generatedCss = transformTextItalicKeyToCss(styleKey, className);
  } else if (styleKey.startsWith('textWeight')) {
    generatedCss = transformTextWeightKeyToCss(styleKey, className);
  } else if (generatedCss === undefined) {
    // Scales --------------------------------------------------------------------------------------
    const matchDim = scaleProperties.find((dim) => styleKey.startsWith(dim));
    if (matchDim) {
      generatedCss = transformDimensionKeyToCss(styleKey, breakpoints);
    } else {
      // Pallets -----------------------------------------------------------------------------------
      const colorProperties = Object.keys(CssColorProperty) as ColorProperty[];
      const matchColor = colorProperties.find((color) => styleKey.startsWith(color));
      if (matchColor !== undefined) {
        generatedCss = transformColorKeyToCss(styleKey);
      }
    }
  }

  if (generatedCss === undefined) {
    throw new Error(`Unsupported style key: ${styleKey}`);
  }

  return generatedCss;
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
export async function generateCssFromStyleKeyList(
  styleKeyList: Record<string, number>
): Promise<string> {
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
    const generatedCss = generateCssRuleFromStyleKey(styleKey);

    // const cssRule = extractCssClassName(rule);
    // console.log({ styleKey, generatedCss });

    // Replace the original class name with the assigned token.
    // const token = tokenMapping[styleKey];
    // rule = rule.replace(new RegExp(`\\.${styleKey}\\b`), `.${token}`);
    cssRuleList.push(generatedCss);
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
