import type { StyleKeyUsageMap } from '../phase-2-map-style-key-usage/mapStyleKeyUsage';
import type { StyleKey } from '@kiskadee/schema';
import { getToken } from '../utils';

export type ShortenCssClassNames = Record<StyleKey, string>;

export function shortenCssClassNames(usage: StyleKeyUsageMap): ShortenCssClassNames {
  const result: ShortenCssClassNames = {};
  let index = 0;

  // Assign tokens in order of descending usage (mapStyleKeyUsage already sorts it)
  for (const key of Object.keys(usage) as StyleKey[]) {
    result[key] = getToken(index++);
  }

  return result;
}
