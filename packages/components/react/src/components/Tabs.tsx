import type { TabsProps as HeadlessTabsProps } from '@kiskadee/react-headless';
import { Tabs as HeadlessTabs } from '@kiskadee/react-headless';
import { useMemo } from 'react';

export type { TabItem, TabsProps } from '@kiskadee/react-headless';

import { useStyleClasses } from '../contexts/StyleClassesContext';

export default function Tabs(props: HeadlessTabsProps) {
  const { classNames: userClassNames } = props;
  const { classesMap, palette } = useStyleClasses();

  console.log({ classesMap, palette });

  const computed = useMemo<NonNullable<HeadlessTabsProps['classNames']>>(() => {
    const pal = palette;
    const { e1: tabsE1, e2: listE2, e3: tabE3, e4: panelE4 } = classesMap?.tabs ?? {};

    const rootParts: string[] = [];
    if (tabsE1?.decorations) rootParts.push(...tabsE1.decorations);
    if (tabsE1?.scales?.['s:all']) rootParts.push(...tabsE1.scales['s:all']);
    if (tabsE1?.palettes?.[pal]?.neutral?.rest)
      rootParts.push(...tabsE1.palettes[pal].neutral.rest);

    const listParts: string[] = [];
    if (listE2?.decorations) listParts.push(...listE2.decorations);
    if (listE2?.palettes?.[pal]?.primary?.rest)
      listParts.push(...listE2.palettes[pal].primary.rest);

    const tabRestParts: string[] = [];
    const tabSelectedParts: string[] = [];
    if (tabE3?.decorations) {
      tabRestParts.push(...tabE3.decorations);
      tabSelectedParts.push(...tabE3.decorations);
    }
    const tabPrimary = tabE3?.palettes?.[pal];
    if (tabPrimary?.neutral?.rest) tabRestParts.push(...tabPrimary.neutral.rest);
    if (tabPrimary?.neutral?.hover) tabRestParts.push(...tabPrimary.neutral.hover);
    if (tabPrimary?.primary?.selected) tabSelectedParts.push(...tabPrimary.primary.selected);
    if (tabPrimary?.primary?.hover) tabSelectedParts.push(...tabPrimary.primary.hover);
    else if (tabPrimary?.neutral?.rest) tabSelectedParts.push(...tabPrimary.neutral.rest);

    const panelParts: string[] = [];
    if (panelE4?.decorations) panelParts.push(...panelE4.decorations);
    if (panelE4?.palettes?.[pal]?.primary?.rest)
      panelParts.push(...panelE4.palettes[pal].primary.rest);

    const u = userClassNames ?? {};
    type CN = NonNullable<HeadlessTabsProps['classNames']>;
    const join = (baseParts: string[], key: keyof CN) =>
      `${baseParts.join(' ')} ${u[key] ?? ''}`.trim();

    return {
      e1: join(rootParts, 'e1'),
      e2: join(listParts, 'e2'),
      e3: join(tabRestParts, 'e3'),
      e3a: join(tabSelectedParts, 'e3a'),
      e4: join(panelParts, 'e4')
    };
  }, [classesMap, palette, userClassNames]);

  return <HeadlessTabs {...props} classNames={computed} />;
}
