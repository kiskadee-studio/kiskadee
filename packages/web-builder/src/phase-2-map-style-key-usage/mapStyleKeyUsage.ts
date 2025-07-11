import type { ComponentStyleKeyMap, StyleKey } from '@kiskadee/schema';

export type StyleKeyUsageMap = Record<StyleKey, number>;

export function mapStyleKeyUsage(styleKeysByComponent: ComponentStyleKeyMap): StyleKeyUsageMap {
  const usage: StyleKeyUsageMap = {};

  const increment = (key: StyleKey) => {
    usage[key] = (usage[key] ?? 0) + 1;
  };

  // Iterate over each component
  for (const elements of Object.values(styleKeysByComponent)) {
    if (!elements) continue;

    // Iterate over each element in the component
    for (const element of Object.values(elements)) {
      // 1) decorations
      element.decorations?.forEach(increment);

      // 2) effects (by interaction state)
      for (const keys of Object.values(element.effects ?? {})) {
        keys?.forEach(increment);
      }

      // 3) scales (by size/responsiveness)
      for (const keys of Object.values(element.scales ?? {})) {
        keys?.forEach(increment);
      }

      // 4) palettes (by palette / semantic color / interaction state)
      for (const semanticColors of Object.values(element.palettes ?? {})) {
        if (!semanticColors) continue;
        for (const interactionStates of Object.values(semanticColors)) {
          if (!interactionStates) continue;
          for (const keys of Object.values(interactionStates)) {
            keys?.forEach(increment);
          }
        }
      }
    }
  }

  // Sort entries: first by descending count, then by key alphabetically
  const sortedEntries = Object.entries(usage).sort(([keyA, countA], [keyB, countB]) => {
    if (countB !== countA) {
      return countB - countA;
    }
    return keyA.localeCompare(keyB);
  });

  // Build a new object with sorted order
  const sortedUsage: StyleKeyUsageMap = {};
  for (const [key, count] of sortedEntries) {
    sortedUsage[key] = count;
  }

  return sortedUsage;
}
