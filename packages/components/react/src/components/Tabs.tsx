import { useMemo } from 'react';
import { Tabs as HeadlessTabs } from '@kiskadee/react-headless';
import type { TabsProps as HeadlessTabsProps } from '@kiskadee/react-headless';
export type { TabItem, TabsProps } from '@kiskadee/react-headless';
import { useStyleClasses } from '../contexts/StyleClassesContext';

export default function Tabs(props: HeadlessTabsProps) {
  const { className, listClassName, tabClassName, tabActiveClassName, panelClassName } = props;
  const { classesMap, palette } = useStyleClasses();

  const computed = useMemo(() => {
    const partsRoot: string[] = [];
    const partsList: string[] = [];
    const partsTab: string[] = [];
    const partsTabActive: string[] = [];
    const partsPanel: string[] = [];

    const e1 = (classesMap as any)?.tabs?.e1;
    const e2 = (classesMap as any)?.tabs?.e2;
    if (e1?.decorations) partsRoot.push(...e1.decorations);
    const p1 = e1?.palettes?.[palette]?.primary?.rest ?? [];
    const p2 = e2?.palettes?.[palette]?.primary?.rest ?? [];
    partsRoot.push(...p1, ...p2);

    const list = (classesMap as any)?.tabsList?.e1;
    if (list?.decorations) partsList.push(...list.decorations);
    if (list?.palettes?.[palette]?.primary?.rest)
      partsList.push(...list.palettes[palette]!.primary!.rest!);

    const tab = (classesMap as any)?.tab?.e1;
    if (tab?.decorations) partsTab.push(...tab.decorations);
    if (tab?.palettes?.[palette]?.primary?.rest)
      partsTab.push(...tab.palettes[palette]!.primary!.rest!);

    const tabActive = (classesMap as any)?.tab?.e2;
    if (tabActive?.decorations) partsTabActive.push(...tabActive.decorations);
    if (tabActive?.palettes?.[palette]?.primary?.rest)
      partsTabActive.push(...tabActive.palettes[palette]!.primary!.rest!);

    const panel = (classesMap as any)?.tabPanel?.e1;
    if (panel?.decorations) partsPanel.push(...panel.decorations);
    if (panel?.palettes?.[palette]?.primary?.rest)
      partsPanel.push(...panel.palettes[palette]!.primary!.rest!);

    return {
      root: [partsRoot.join(' '), className].filter(Boolean).join(' '),
      list: [partsList.join(' '), listClassName].filter(Boolean).join(' '),
      tab: [partsTab.join(' '), tabClassName].filter(Boolean).join(' '),
      tabActive: [partsTabActive.join(' '), tabActiveClassName].filter(Boolean).join(' '),
      panel: [partsPanel.join(' '), panelClassName].filter(Boolean).join(' ')
    };
  }, [classesMap, palette, className, listClassName, tabClassName, tabActiveClassName, panelClassName]);

  return (
    <HeadlessTabs
      {...props}
      className={computed.root}
      listClassName={computed.list}
      tabClassName={computed.tab}
      tabActiveClassName={computed.tabActive}
      panelClassName={computed.panel}
    />
  );
}
