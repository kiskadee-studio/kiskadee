import type { Appearance, InteractionStatesProperties, ShadowStyle } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

export function processAppearance(appearance: Appearance) {
  for (const [key, value] of Object.entries(appearance)) {
    if (!key.startsWith('shadow')) {
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        const keyValue = `${key}__${value}`;
        styleUsageMap[keyValue] = (styleUsageMap[keyValue] || 0) + 1;
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

    const interactionStates = new Set([
      ...(hasRestState ? ['rest'] : []),
      ...Object.keys(shadowX),
      ...Object.keys(shadowY),
      ...Object.keys(shadowBlur),
      ...Object.keys(shadowColor)
    ] as InteractionStatesProperties[]);

    for (const interactionState of interactionStates) {
      const color = shadowColor[interactionState] || [0, 0, 0, 1]; // Default to black HLSA
      const hlsa = `hlsa-${color.join('-')}`;

      const shadowParts = [
        `${shadowX[interactionState] || 0}px`,
        `${shadowY[interactionState] || 0}px`,
        `${shadowBlur[interactionState] || 0}px`
      ];

      const shadowKey = `shadow${interactionState === 'rest' ? '' : `::${interactionState}`}__${shadowParts.join(
        '--'
      )}--${hlsa}`;

      styleUsageMap[shadowKey] = (styleUsageMap[shadowKey] || 0) + 1;
    }
  }
}
