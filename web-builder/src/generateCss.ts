import { convertFontStyle } from './phrase-2-convert-key-to-css/convertTextStyle';
import { convertTextAlign } from './phrase-2-convert-key-to-css/appearance/convertTextAlign';

const style2 = {
  textItalic__true: 1,
  textWeight__bold: 1,
  textDecoration__underline: 1,
  textTransform__uppercase: 1,
  textAlign__center: 1,
  cursor__pointer: 1,
  borderStyle__solid: 1,
  'shadow__[0,0,0,[0,0,0,0.5]]': 1,
  'shadow--hover__[4,4,4,[0,0,0,0.5]]': 1,
  'fontSize--sm__12': 1,
  'fontSize--md__16': 1,
  'fontSize--md::lg1__14': 1,
  'fontSize--lg__20': 1,
  'fontSize--lg::lg1__18': 1,
  paddingTop__10: 1,
  paddingRight__8: 1,
  paddingBottom__8: 1,
  paddingLeft__8: 1,
  marginTop__8: 1,
  marginRight__16: 1,
  marginBottom__8: 1,
  marginLeft__16: 1,
  'height--md__40': 1,
  'height--lg__48': 1,
  'height--lg::lg1__44': 1,
  width__120: 1,
  borderWidth__1: 1,
  borderRadius__4: 1,
  lineHeight__24: 1,
  'textColor__[0,0,0,0.5]': 2,
  'borderColor__[0,0,0,0.5]': 1,
  'bgColor__[10,35,100,0]': 2,
  'bgColor--hover__[10,35,100,0]': 2,
  'bgColor__[0,0,0,0.5]': 1,
  'textColor--hover::ref__[0,0,0,0.5]': 1
};

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
 * Generates a CSS class rule for a text decoration property key.
 * For example, for key "textDecoration__underline" returns:
 *   ".textDecoration__underline { text-decoration: underline; }"
 *
 * @param key - The style key to process.
 * @returns The CSS rule as a string or null if the key doesn't match.
 */
function generateCssTextDecorationForKey(key: string): string | null {
  if (!key.startsWith('textDecoration__')) {
    return null;
  }

  const parts = key.split('__');
  if (parts.length !== 2) {
    return null;
  }

  return `.${key} { text-decoration: ${parts[1]}; }`;
}

/**
 * Generates CSS rules from the style object by iterating just once over its keys.
 * Keys are first sorted by their numeric values (descending), then reassigned tokens.
 *
 * @param style - The style object with keys and numeric values.
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
export function generateCssFromStyle(style: Record<string, number>): string {
  const cssRules: string[] = [];

  // Get an array of keys sorted by their frequency (highest first)
  const sortedKeys = Object.keys(style).sort((a, b) => style[b] - style[a]);

  // Map to store the token for each key.
  const tokenMapping: Record<string, string> = {};

  // Assign tokens based on sorted order.
  sortedKeys.forEach((key, index) => {
    tokenMapping[key] = getToken(index);
  });

  // Iterate over the sorted keys and generate CSS rules using tokens.
  for (const key of sortedKeys) {
    // Try each helper function.
    let rule: string | null = convertFontStyle(key);
    if (!rule) {
      rule = generateCssTextDecorationForKey(key);
    }
    if (!rule) {
      rule = convertTextAlign(key);
    }

    // If no rule could be generated, skip this key.
    if (!rule) {
      continue;
    }

    // Replace the original class name with the assigned token.
    const token = tokenMapping[key];
    rule = rule.replace(new RegExp(`\\.${key}\\b`), `.${token}`);
    cssRules.push(rule);
  }

  return cssRules.join('\n');
}

// Example usage:
const styleExample = {
  textItalic__true: 3,
  textAlign__center: 6,
  textDecoration__underline: 9,
  'fontSize--sm__12': 1,
  'height--lg::lg1__44': 1
};

console.log(generateCssFromStyle(styleExample));

/*
Expected Output:
.a { font-style: italic; }
.b { text-align: center; }
.c { text-decoration: underline; }
*/
