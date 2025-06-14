import {
  type ColorKeys,
  CssColorProperty,
  type HLSA,
  InteractionStateCssMapping
} from '@kiskadee/schema';
import { convertHslaToHex } from '../utils/convertHslaToHex';
import type { GeneratedCss } from '../phrase2.types';

/**
 * Converts a palette key into a GeneratedCss object.
 *
 * @param styleKey - palette key including HSLA in brackets and optional ::ref state
 * @returns object with:
 *   - className: selector name without leading dot
 *   - cssRule: full CSS rule string
 *   - parentClassName: selector name of parent element when ::ref is used
 */
export function transformColorKeyToCss(styleKey: string): GeneratedCss {
  const valueMatch = styleKey.match(/\[([^\]]+)]$/);
  if (valueMatch == null) {
    throw new Error('Invalid key format. Expected value in square brackets at the end.');
  }

  const hsla = valueMatch[1].split(',').map((v) => Number.parseFloat(v)) as HLSA;
  const hexColor = convertHslaToHex(hsla);

  const colorKey = styleKey.split(/--|__/)[0] as ColorKeys;
  const cssProperty = CssColorProperty[colorKey];

  let cssRule: string;
  let className: string;
  let parentClassName: string | undefined;

  if (styleKey.includes('::ref') === false) {
    // no reference state, use full key as className
    className = styleKey;
    cssRule = `.${styleKey} { ${cssProperty}: ${hexColor}; }`;
  } else {
    // reference state present, extract child selector
    const [refSelector] = styleKey.split('__');
    className = refSelector;

    const validStates = Object.values(InteractionStateCssMapping)
      .map((val) => val.replace(/^:/, ''))
      .join('|');
    const stateRegex = new RegExp(`--(${validStates})(?=::ref)`);
    const stateMatch = refSelector.match(stateRegex);
    if (stateMatch == null) {
      throw new Error(
        `Invalid key format. "::ref" requires a preceding interaction state. ${refSelector}`
      );
    }

    parentClassName = styleKey;
    cssRule = `.${styleKey}:${stateMatch[1]} .${refSelector} { ${cssProperty}: ${hexColor}; }`;
  }

  return { className, parentClassName, cssRule };
}
