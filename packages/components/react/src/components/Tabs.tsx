import { useMemo } from 'react';
import { Tabs as HeadlessTabs } from '@kiskadee/react-headless';
import type { TabsProps as HeadlessTabsProps } from '@kiskadee/react-headless';
export type { TabItem, TabsProps } from '@kiskadee/react-headless';
import type { ComponentClassNameMapJSON } from '@kiskadee/schema';
import { useStyleClasses } from '../contexts/StyleClassesContext';

// Local minimal typings to safely access the schema without using `any`
// Element classes hold optional decorations and palette-driven class lists.
type PaletteClasses = {
  decorations?: string[];
  palettes?: Record<string, { primary?: { rest?: string[]; selected?: string[] } }>;
};

// Each component (e.g., "tabs", "tabsList", "tab", "tabPanel") maps e-keys to PaletteClasses
type ComponentElements = Partial<Record<'e1' | 'e2' | 'e3' | 'e3a' | 'e5', PaletteClasses>>;

// The full classes map is an index of components by key
type ClassesMapIndex = Record<string, ComponentElements>;

function getComponent(map: ComponentClassNameMapJSON, key: string): ComponentElements | undefined {
  return (map as unknown as ClassesMapIndex)[key];
}

export default function Tabs(props: HeadlessTabsProps) {
  const { classNames: userClassNames } = props;
  const { classesMap, palette } = useStyleClasses();

  const computed = useMemo<NonNullable<HeadlessTabsProps['classNames']>>(() => {
    const partsRoot: string[] = [];
    const partsList: string[] = [];
    const partsPanel: string[] = [];
    const partsTabRest: string[] = [];
    const partsTabSelected: string[] = [];

    const tabsComp = getComponent(classesMap, 'tabs');
    const e1 = tabsComp?.e1;
    const e2 = tabsComp?.e2;
    if (e1?.decorations) partsRoot.push(...e1.decorations);
    const p1 = e1?.palettes?.[palette]?.primary?.rest ?? [];
    const p2 = e2?.palettes?.[palette]?.primary?.rest ?? [];
    partsRoot.push(...p1, ...p2);

    const list = getComponent(classesMap, 'tabsList')?.e1;
    if (list?.decorations) partsList.push(...list.decorations);
    if (list?.palettes?.[palette]?.primary?.rest)
      partsList.push(...list.palettes[palette]!.primary!.rest!);

    const tab = getComponent(classesMap, 'tab')?.e1;
    if (tab?.decorations) {
      partsTabRest.push(...tab.decorations);
      partsTabSelected.push(...tab.decorations);
    }
    const tabPrimary = tab?.palettes?.[palette]?.primary;
    if (tabPrimary?.rest) partsTabRest.push(...tabPrimary.rest);
    if (tabPrimary?.selected) partsTabSelected.push(...tabPrimary.selected);
    else if (tabPrimary?.rest) partsTabSelected.push(...tabPrimary.rest);

    const panel = getComponent(classesMap, 'tabPanel')?.e1;
    if (panel?.decorations) partsPanel.push(...panel.decorations);
    if (panel?.palettes?.[palette]?.primary?.rest)
      partsPanel.push(...panel.palettes[palette]!.primary!.rest!);

    const e1Str = [partsRoot.join(' '), userClassNames?.e1].filter(Boolean).join(' ');
    const e2Str = [partsList.join(' '), userClassNames?.e2].filter(Boolean).join(' ');
    const e3Str = [partsTabRest.join(' '), userClassNames?.e3].filter(Boolean).join(' ');
    const e3aStr = [partsTabSelected.join(' '), userClassNames?.e3a].filter(Boolean).join(' ');
    const e5Str = [partsPanel.join(' '), userClassNames?.e5].filter(Boolean).join(' ');

    return {
      e1: e1Str,
      e2: e2Str,
      e3: e3Str,
      e3a: e3aStr,
      e5: e5Str
    };
  }, [classesMap, palette, userClassNames]);

  return (
    <HeadlessTabs
      {...props}
      classNames={computed}
    />
  );
}
