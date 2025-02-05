import type { Appearance, Shadow } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

export function processAppearance(appearance: Appearance) {
  const shadowStates: Record<string, string[]> = {};

  const processState = (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      for (const [state, stateValue] of Object.entries(value)) {
        const prefixedKey =
          state === 'rest'
            ? `${key}__${stateValue}` // "rest" prefix removed
            : `${key}::${state}__${stateValue}`;
        if (typeof stateValue === 'number' || typeof stateValue === 'string') {
          styleUsageMap[prefixedKey] = (styleUsageMap[prefixedKey] || 0) + 1;
        }
      }
    }
  };

  // Process general properties
  for (const [key, value] of Object.entries(appearance)) {
    if (!key.startsWith('shadow')) {
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        const keyValue = `${key}__${value}`;
        styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
      } else {
        processState(key, value);
      }
    }
  }

  // Process shadows only if at least one shadow property is defined
  const hasShadowProperty =
    'shadowColor' in appearance ||
    'shadowX' in appearance ||
    'shadowY' in appearance ||
    'shadowBlur' in appearance;

  if (hasShadowProperty) {
    const shadowX = appearance.shadowX || {};
    const shadowY = appearance.shadowY || {};
    const shadowBlur = appearance.shadowBlur || {};
    const shadowColor = appearance.shadowColor || {};

    // Only include "rest" state if rest values are explicitly defined
    const hasRestState =
      'rest' in shadowX || 'rest' in shadowY || 'rest' in shadowBlur || 'rest' in shadowColor;

    const states = new Set([
      ...(hasRestState ? ['rest'] : []),
      ...Object.keys(shadowX),
      ...Object.keys(shadowY),
      ...Object.keys(shadowBlur),
      ...Object.keys(shadowColor)
    ]);

    for (const state of states) {
      const color = shadowColor[state] || [0, 0, 0, 1]; // Default to black HLSA: [h, l, s, alpha]
      const hlsa = `hlsa-${color.join('-')}`; // Properly formatted HLSA string

      const shadowParts = [
        `${shadowX[state] || 0}px`,
        `${shadowY[state] || 0}px`,
        `${shadowBlur[state] || 0}px`
      ];

      const shadowKey = `shadow${state === 'rest' ? '' : `::${state}`}__${shadowParts.join(
        '--'
      )}--${hlsa}`;

      styleUsageMap[shadowKey] = (styleUsageMap[shadowKey] || 0) + 1;
    }
  }
}
