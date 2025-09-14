import type { ReactNode } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useStyleClasses } from '../contexts/StyleClassesContext';

export type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items: TabItem[];
  value?: string; // controlled selected tab id
  defaultValue?: string; // initial tab ID for uncontrolled mode
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual'; // automatic: focus changes selection; manual: Enter/Space selects
  idPrefix?: string; // helpful when multiple Tabs on the page
  // Optional className overrides
  className?: string;
  listClassName?: string;
  tabClassName?: string;
  tabActiveClassName?: string;
  panelClassName?: string;
};

/**
 * Accessible Tabs component following WAI-ARIA Authoring Practices.
 * - Keyboard navigation: Arrow keys, Home/End, Enter/Space (manual mode)
 * - Roles and properties: tablist, tab, tabpanel, aria-selected, aria-controls
 * - Roving tabindex approach for tabs
 */
export default function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  idPrefix,
  className,
  listClassName,
  tabClassName,
  tabActiveClassName,
  panelClassName
}: TabsProps) {
  const internalId = useId();
  const baseId = idPrefix ?? `tabs-${internalId}`;

  const { classesMap, palette } = useStyleClasses();

  // Compute class names based on optional classes map if available
  const computed = useMemo(() => {
    const partsRoot: string[] = [];
    const partsList: string[] = [];
    const partsTab: string[] = [];
    const partsTabActive: string[] = [];
    const partsPanel: string[] = [];

    const e1 = (classesMap as any)?.tabs?.e1;
    const e2 = (classesMap as any)?.tabs?.e2;
    // Decorational/base styles
    if (e1?.decorations) partsRoot.push(...e1.decorations);
    // Palette-aware styles (best-effort if defined)
    const p1 = e1?.palettes?.[palette]?.primary?.rest ?? [];
    const p2 = e2?.palettes?.[palette]?.primary?.rest ?? [];
    partsRoot.push(...p1, ...p2);

    // Allow sub-keys if present in classes map
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
  }, [
    classesMap,
    palette,
    className,
    listClassName,
    tabClassName,
    tabActiveClassName,
    panelClassName
  ]);

  // Controlled/uncontrolled selected value
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(
    defaultValue ?? items.find((i) => !i.disabled)?.id
  );
  const selected = isControlled ? value : uncontrolled;

  const setSelected = useCallback(
    (v: string) => {
      if (!isControlled) setUncontrolled(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  // Focus management refs for tabs
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Ensure the selected tab is focusable (tabIndex=0) and others are -1 using roving tabindex
  const focusableId = useMemo(() => {
    // If selected is disabled or undefined, pick first enabled
    const enabledIds = items.filter((i) => !i.disabled).map((i) => i.id);
    if (!enabledIds.length) return undefined;
    if (selected && enabledIds.includes(selected)) return selected;
    return enabledIds[0];
  }, [items, selected]);

  // Keyboard navigation
  const moveFocus = useCallback(
    (currentId: string, direction: 1 | -1) => {
      const enabled = items.filter((i) => !i.disabled).map((i) => i.id);
      const idx = enabled.indexOf(currentId);
      if (idx === -1) return;
      const next = enabled[(idx + direction + enabled.length) % enabled.length];
      tabRefs.current[next]?.focus();
      if (activationMode === 'automatic') setSelected(next);
    },
    [items, activationMode, setSelected]
  );

  const focusFirst = useCallback(() => {
    const first = items.find((i) => !i.disabled)?.id;
    if (first) {
      tabRefs.current[first]?.focus();
      if (activationMode === 'automatic') setSelected(first);
    }
  }, [items, activationMode, setSelected]);

  const focusLast = useCallback(() => {
    const last = [...items].reverse().find((i) => !i.disabled)?.id;
    if (last) {
      tabRefs.current[last]?.focus();
      if (activationMode === 'automatic') setSelected(last);
    }
  }, [items, activationMode, setSelected]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const active = document.activeElement as HTMLElement | null;
      const currentId = active?.getAttribute('data-tab-id') || undefined;

      const horizontal = orientation === 'horizontal';
      switch (e.key) {
        case 'ArrowRight':
          if (horizontal && currentId) {
            e.preventDefault();
            moveFocus(currentId, 1);
          }
          break;
        case 'ArrowLeft':
          if (horizontal && currentId) {
            e.preventDefault();
            moveFocus(currentId, -1);
          }
          break;
        case 'ArrowDown':
          if (!horizontal && currentId) {
            e.preventDefault();
            moveFocus(currentId, 1);
          }
          break;
        case 'ArrowUp':
          if (!horizontal && currentId) {
            e.preventDefault();
            moveFocus(currentId, -1);
          }
          break;
        case 'Home':
          e.preventDefault();
          focusFirst();
          break;
        case 'End':
          e.preventDefault();
          focusLast();
          break;
        case 'Enter':
        case ' ': // Space
          if (activationMode === 'manual' && currentId) {
            e.preventDefault();
            setSelected(currentId);
          }
          break;
      }
    },
    [orientation, activationMode, moveFocus, focusFirst, focusLast, setSelected]
  );

  // When the selected tab becomes disabled dynamically, move to the nearest enabled
  useEffect(() => {
    if (!selected) return;
    const current = items.find((i) => i.id === selected);
    if (current && current.disabled) {
      const enabled = items.filter((i) => !i.disabled).map((i) => i.id);
      const idx = enabled.indexOf(selected);
      const next = enabled[idx] ?? enabled[0];
      if (next) setSelected(next);
    }
  }, [items, selected, setSelected]);

  return (
    <div className={computed.root}>
      <div
        role="tablist"
        aria-orientation={orientation}
        className={computed.list}
        onKeyDown={onKeyDown}
      >
        {items.map((item) => {
          const isSelected = item.id === selected;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;
          const classes = [computed.tab, isSelected ? computed.tabActive : undefined]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={item.id}
              ref={(el) => (tabRefs.current[item.id] = el)}
              id={tabId}
              data-tab-id={item.id}
              role="tab"
              type="button"
              className={classes}
              aria-selected={isSelected}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              tabIndex={focusableId === item.id && !item.disabled ? 0 : -1}
              onClick={() => !item.disabled && setSelected(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const isSelected = item.id === selected;
        const tabId = `${baseId}-tab-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div
            key={item.id}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            hidden={!isSelected}
            className={computed.panel}
          >
            {isSelected ? item.content : null}
          </div>
        );
      })}
    </div>
  );
}
