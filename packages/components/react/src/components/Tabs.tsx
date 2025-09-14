import type { TabsProps as HeadlessTabsProps } from '@kiskadee/react-headless';
import { Tabs as HeadlessTabs } from '@kiskadee/react-headless';
import { useMemo } from 'react';

export type { TabItem, TabsProps } from '@kiskadee/react-headless';

import { useStyleClasses } from '../contexts/StyleClassesContext';

export default function Tabs(props: HeadlessTabsProps) {
  const { classNames: userClassNames } = props;
  const { classesMap, palette } = useStyleClasses();

  const computed = useMemo<NonNullable<HeadlessTabsProps['classNames']>>(() => {
    const pal = palette;

    const tabsE1 = classesMap?.tabs?.e1; // element e1: root
    const listE1 = classesMap?.tabs?.e2; // element e2: list
    const tabE1 = classesMap?.tabs?.e3; // element e3: tab
    const panelE1 = classesMap?.tabs?.e4; // element e4: panel

    const rootParts: string[] = [];
    if (tabsE1?.decorations) rootParts.push(...tabsE1.decorations);
    if (tabsE1?.palettes?.[pal]?.primary?.rest)
      rootParts.push(...tabsE1.palettes[pal].primary.rest);

    const listParts: string[] = [];
    if (listE1?.decorations) listParts.push(...listE1.decorations);
    if (listE1?.palettes?.[pal]?.primary?.rest)
      listParts.push(...listE1.palettes[pal].primary.rest);

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
    if (panelE1?.palettes?.[pal]?.primary?.rest)
      panelParts.push(...panelE1.palettes[pal].primary.rest);

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
