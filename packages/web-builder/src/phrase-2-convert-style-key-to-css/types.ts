/**
 * Represents a generated CSS rule produced from a style key.
 *
 * Returned by all `transform*KeyToCss` functions, it contains:
 * - `className`: the CSS class selector (without the leading dot)
 * - `cssRule`: the full CSS rule string (selector + declarations)
 */
export type GeneratedCss = {
  /** CSS class selector name (without the leading dot) */
  className: string;

  /** Complete CSS rule string, including selector and declarations */
  cssRule: string;
};
