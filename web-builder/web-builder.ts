import type { Appearance, InteractionStatesProperties, ShadowStyle } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

export function processAppearance(appearance: Appearance) {
  const processState = (
    key: string,
    value: Partial<Record<InteractionStatesProperties, string | number>>
  ) => {
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

  const hasShadowProperty =
    'shadowColor' in appearance ||
    'shadowX' in appearance ||
    'shadowY' in appearance ||
    'shadowBlur' in appearance;

  if (hasShadowProperty) {
    const { shadowX = {}, shadowY = {}, shadowBlur = {}, shadowColor = {} } = appearance;

    // Only include "rest" state if rest values are explicitly defined
    const hasRestState =
      'rest' in shadowX || 'rest' in shadowY || 'rest' in shadowBlur || 'rest' in shadowColor;

    const states = new Set([
      ...(hasRestState ? ['rest'] : []),
      ...Object.keys(shadowX),
      ...Object.keys(shadowY),
      ...Object.keys(shadowBlur),
      ...Object.keys(shadowColor)
    ] as InteractionStatesProperties[]);

    for (const state of states) {
      const color = shadowColor[state] || [0, 0, 0, 1]; // Default to black HLSA
      const hlsa = `hlsa-${color.join('-')}`;

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
