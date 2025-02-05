import type { Appearance, Shadow } from '@kiskadee/schema';
import { styleUsageMap } from './utils';

export function processAppearance(appearance: Appearance) {
  // Auxiliary variables to store shadow states
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

  // Process general appearance properties
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

  // Validate and process shadows
  const shadowProvided = 'shadowColor' in appearance;
  const hasShadowNumbers = appearance.shadowX || appearance.shadowY || appearance.shadowBlur;

  if (shadowProvided && hasShadowNumbers) {
    const shadowColor = Array.isArray(appearance.shadowColor)
      ? `rgba-${appearance.shadowColor.join('-')}`
      : 'rgba-0-0-0-0';

    const shadowX = appearance.shadowX || { rest: 0 };
    const shadowY = appearance.shadowY || { rest: 0 };
    const shadowBlur = appearance.shadowBlur || { rest: 0 };

    const shadow = { shadowX, shadowY, shadowBlur };

    for (const [property, stateValues] of Object.entries(shadow)) {
      if (
        ['shadowX', 'shadowY', 'shadowBlur'].includes(property) &&
        typeof stateValues === 'object' &&
        stateValues !== null
      ) {
        for (const state of Object.keys(stateValues)) {
          shadowStates[state] = shadowStates[state] || [];
          const stateValue = stateValues[state as keyof typeof stateValues];
          shadowStates[state].push(`${stateValue ?? 0}px`);
        }
      }
    }

    // Build shadow strings for each state
    for (const [state, shadowParts] of Object.entries(shadowStates)) {
      const shadowKey = `shadow${state === 'rest' ? '' : `::${state}`}__${shadowParts.join(
        '--'
      )}--${shadowColor}`;
      styleUsageMap[shadowKey] = (styleUsageMap[shadowKey] || 0) + 1;
    }
  }
}
