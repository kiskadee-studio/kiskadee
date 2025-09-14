import { useMemo } from 'react';
import { Tabs as HeadlessTabs } from '@kiskadee/react-headless';
import type { TabsProps as HeadlessTabsProps } from '@kiskadee/react-headless';
export type { TabItem, TabsProps } from '@kiskadee/react-headless';
import { useStyleClasses } from '../contexts/StyleClassesContext';

export default function Tabs(props: HeadlessTabsProps) {
  const { classNames: userClassNames } = props;
  const { classesMap, palette } = useStyleClasses();

  const computed = useMemo<NonNullable<HeadlessTabsProps['classNames']>>(() => {
    const pal = palette;

    const tabsE1 = classesMap?.tabs?.e1;
    const tabsE2 = classesMap?.tabs?.e2;
    const listE1 = classesMap?.tabsList?.e1;
    const tabE1 = classesMap?.tab?.e1;
    const panelE1 = classesMap?.tabPanel?.e1;

    const rootParts: string[] = [];
    if (tabsE1?.decorations) rootParts.push(...tabsE1.decorations);
    if (tabsE1?.palettes?.[pal]?.primary?.rest) rootParts.push(...tabsE1.palettes[pal]!.primary!.rest!);
    if (tabsE2?.palettes?.[pal]?.primary?.rest) rootParts.push(...tabsE2.palettes[pal]!.primary!.rest!);

    const listParts: string[] = [];
    if (listE1?.decorations) listParts.push(...listE1.decorations);
    if (listE1?.palettes?.[pal]?.primary?.rest) listParts.push(...listE1.palettes[pal]!.primary!.rest!);

    const tabRestParts: string[] = [];
    const tabSelectedParts: string[] = [];
    if (tabE1?.decorations) {
      tabRestParts.push(...tabE1.decorations);
      tabSelectedParts.push(...tabE1.decorations);
    }
    const tabPrimary = tabE1?.palettes?.[pal]?.primary;
    if (tabPrimary?.rest) tabRestParts.push(...tabPrimary.rest);
    if (tabPrimary?.selected) tabSelectedParts.push(...tabPrimary.selected);
    else if (tabPrimary?.rest) tabSelectedParts.push(...tabPrimary.rest);

    const panelParts: string[] = [];
    if (panelE1?.decorations) panelParts.push(...panelE1.decorations);
    if (panelE1?.palettes?.[pal]?.primary?.rest) panelParts.push(...panelE1.palettes[pal]!.primary!.rest!);

    return {
      e1: (`${rootParts.join(' ')} ${userClassNames?.e1 ?? ''}`).trim(),
      e2: (`${listParts.join(' ')} ${userClassNames?.e2 ?? ''}`).trim(),
      e3: (`${tabRestParts.join(' ')} ${userClassNames?.e3 ?? ''}`).trim(),
      e3a: (`${tabSelectedParts.join(' ')} ${userClassNames?.e3a ?? ''}`).trim(),
      e5: (`${panelParts.join(' ')} ${userClassNames?.e5 ?? ''}`).trim()
    };
  }, [classesMap, palette, userClassNames]);

  return (
    <HeadlessTabs
      {...props}
      classNames={computed}
    />
  );
}
