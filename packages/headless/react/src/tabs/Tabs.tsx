import type { KeyboardEvent, ReactNode } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

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
  /**
   * Class names by compact element keys:
   * - e1: Tabs root container (div)
   * - e2: Tab list (role=tablist)
   * - e3: Tab button (role=tab) — rest state
   * - e3a: Tab button (role=tab) — selected state
   * - e4: Tab panel (role=tabpanel)
   */
  classNames?: Partial<Record<'e1' | 'e2' | 'e3' | 'e3a' | 'e4', string>>;
};

/**
 * Headless, accessible Tabs component following WAI-ARIA Authoring Practices.
 * - Keyboard navigation: Arrow keys, Home/End, Enter/Space (manual mode)
 * - Roles and properties: tablist, tab, tabpanel, aria-selected, aria-controls
 * - Roving tabindex approach for tabs
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  idPrefix,
  classNames
}: TabsProps) {
  const internalId = useId();
  const baseId = idPrefix ?? `tabs-${internalId}`;

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
    (e: KeyboardEvent<HTMLDivElement>) => {
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
    if (current?.disabled) {
      const enabled = items.filter((i) => !i.disabled).map((i) => i.id);
      const idx = enabled.indexOf(selected);
      const next = enabled[idx] ?? enabled[0];
      if (next) setSelected(next);
    }
  }, [items, selected, setSelected]);

  return (
    <>
      {/* Element e1 — Tabs root container (root) */}
      <div className={classNames?.e1}>
        {/* Element e2 — Tab list (role=tablist) */}
        <div
          role="tablist"
          aria-orientation={orientation}
          className={classNames?.e2}
          onKeyDown={onKeyDown}
        >
          {items.map((item) => {
            const isSelected = item.id === selected;
            const tabId = `${baseId}-tab-${item.id}`;
            const panelId = `${baseId}-panel-${item.id}`;
            const classes = isSelected
              ? (classNames?.e3a ?? classNames?.e3 ?? '')
              : (classNames?.e3 ?? '');

            return (
              // Element e3/e3a — Tab button (role=tab). Uses e3 (rest) or e3a (selected)
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[item.id] = el;
                }}
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
            // Element e4 — Tab panel (role=tabpanel)
            <div
              key={item.id}
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId}
              hidden={!isSelected}
              className={classNames?.e4}
            >
              {isSelected ? item.content : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
