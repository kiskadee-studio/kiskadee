import type { TabsProps as HeadlessTabsProps } from '@kiskadee/react-headless';
import { Tabs as HeadlessTabs } from '@kiskadee/react-headless';
import { useMemo } from 'react';

export type { TabItem, TabsProps } from '@kiskadee/react-headless';

import { useKiskadee } from '../contexts/KiskadeeContext.tsx';

export default function Tabs(props: HeadlessTabsProps) {
  const { classNames: userClassNames } = props;
  const { classesMap } = useKiskadee();

  const computed = useMemo<NonNullable<HeadlessTabsProps['classNames']>>(() => {
    const { e1: tabsE1, e2: listE2, e3: tabE3, e4: panelE4 } = classesMap?.tabs ?? {};

    const rootParts: string[] = [];
    if (tabsE1?.d) rootParts.push(tabsE1.d);
    if (tabsE1?.s?.['s:all']) rootParts.push(tabsE1.s['s:all']);
    if (tabsE1?.c?.f) rootParts.push(tabsE1.c.f);
    if (tabsE1?.c?.d) rootParts.push(tabsE1.c.d);
    if (tabsE1?.c?.u) rootParts.push(tabsE1.c.u);

    const listParts: string[] = [];
    if (listE2?.d) listParts.push(listE2.d);
    if (listE2?.c?.f) listParts.push(listE2.c.f);
    if (listE2?.c?.d) listParts.push(listE2.c.d);
    if (listE2?.c?.u) listParts.push(listE2.c.u);

    const tabRestParts: string[] = [];
    const tabSelectedParts: string[] = [];
    if (tabE3?.d) {
      tabRestParts.push(tabE3.d);
      tabSelectedParts.push(tabE3.d);
    }
    if (tabE3?.c?.f) tabRestParts.push(tabE3.c.f);
    if (tabE3?.c?.d) tabRestParts.push(tabE3.c.d);
    if (tabE3?.c?.u) tabRestParts.push(tabE3.c.u);
    if (tabE3?.cs) tabSelectedParts.push(tabE3.cs);

    const panelParts: string[] = [];
    if (panelE4?.d) panelParts.push(panelE4.d);
    if (panelE4?.c?.f) panelParts.push(panelE4.c.f);
    if (panelE4?.c?.d) panelParts.push(panelE4.c.d);
    if (panelE4?.c?.u) panelParts.push(panelE4.c.u);

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
  }, [classesMap, userClassNames]);

  return <HeadlessTabs {...props} classNames={computed} />;
}
