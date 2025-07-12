/**
 * Represents a generated CSS rule produced from a style key.
 *
 * Returned by all `transform*KeyToCss` functions, it contains:
 * - `className`: the CSS class selector name (without the leading dot)
 * - `cssRule`: the full CSS rule string (selector + declarations)
 * - `parentClassName?`: when relevant, the parent’s class selector name (without dot)
 */
export type GeneratedCss = {
  /** CSS class selector name (without the leading dot) */
  className: string;

  /** Complete CSS rule string, including selector and declarations */
  cssRule: string;

  /** Parent CSS class selector name (without the leading dot), if ::ref was used */
  parentClassName?: string;
};
