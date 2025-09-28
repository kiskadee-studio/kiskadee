import type { ButtonProps as HeadlessButtonProps } from '@kiskadee/react-headless';
import { Button as HeadlessButton } from '@kiskadee/react-headless';
import { type ClassNameByElementJSON, classNameCssPseudoSelector as cn } from '@kiskadee/schema';
import { useMemo } from 'react';
import { useKiskadee } from '../../contexts/KiskadeeContext.tsx';
import styles from './Button.module.scss';

export type ButtonStatus = Exclude<keyof typeof cn, 'selected'>;
export type ButtonProps = HeadlessButtonProps & {
  /** Force Kiskadee visual/interaction state on the root element (e1). Excludes 'selected'. */
  status?: ButtonStatus;
  /** Marks this button as a semantic toggle (Following vs. Follow). */
  toggle?: boolean;
  /** Semantic control state (selected/active/checked). When true, selected styles are applied. */
  controlState?: boolean;
};

export default function Button(props: ButtonProps) {
  const { classNames = {}, status = 'rest', toggle, controlState, disabled, ...restProps } = props;
  const {
    // e1 (root), e2 (label), e3 (icon)
    classesMap: { button: { e1, e2, e3 } = {} }
  } = useKiskadee();

  const computed = useMemo<NonNullable<HeadlessButtonProps['classNames']>>(() => {
    // Helper to collect class parts for each element using flattened `d`/`p` (strings) and `s['s:all']` (array)
    const collect = (el: ClassNameByElementJSON): string => {
      if (!el) return '';
      const chunks: string[] = [];
      if (el.d) chunks.push(el.d);
      const sAll = el.s?.['s:all'];
      if (Array.isArray(sAll) && sAll.length > 0) chunks.push(sAll.join(' '));
      const p = el.p;
      if (typeof p === 'string' && p.trim()) chunks.push(p.trim());
      return chunks.join(' ');
    };

    const rootStr = collect(e1);
    const labelStr = collect(e2);
    const iconStr = collect(e3);

    type CN = NonNullable<HeadlessButtonProps['classNames']>;
    const append = (base: string, key: keyof CN) => `${base} ${classNames[key] ?? ''}`.trim();

    const base = {
      e1: append(`${styles.button} ${rootStr}`.trim(), 'e1'),
      e2: append(labelStr, 'e2'),
      e3: append(iconStr, 'e3')
    } as const;

    // Activator pattern for forced states applies to the root (e1) only.
    // We support two sources of forced classes:
    // - status (hover/focus/pressed/disabled/readOnly)
    // - controlState (selected)
    const forcedParts: string[] = [];
    if (status !== 'rest' && cn[status] !== '') forcedParts.push(cn[status]);
    if (controlState) forcedParts.push(cn.selected);

    const activationClasses = forcedParts.length > 0 ? ` ${forcedParts.join(' ')} -a` : '';

    return {
      ...base,
      e1: `${base.e1}${activationClasses}`
    };
  }, [e1, e2, e3, status, controlState, classNames]);

  // Map Kiskadee status to native/ARIA attributes
  // Current behavior:
  // - If the consumer passes `disabled`, we use that value as-is (takes precedence over `status`).
  // - Else if `status === 'disabled'`:
  //     - When `aria-disabled === true`, do NOT set the native `disabled` attribute (element remains interactive).
  //       Visual "disabled" styling is still forced via the activator classes added above.
  //     - Otherwise set `disabled={true}` to use the native disabled state.
  // - In any other case, we leave `disabled` undefined.
  const ariaDisabled = restProps['aria-disabled'];
  let isDisabled: boolean | undefined;
  if (disabled !== undefined) {
    // Always respect the consumer-provided `disabled` prop
    isDisabled = disabled;
  } else if (status === 'disabled') {
    // If aria-disabled is explicitly true, keep the element interactive
    isDisabled = ariaDisabled === true ? undefined : true;
  } else {
    isDisabled = undefined;
  }

  const ariaPressed =
    restProps['aria-pressed'] ?? (toggle ? (controlState === true ? true : undefined) : undefined);

  return (
    <HeadlessButton
      {...restProps}
      disabled={isDisabled}
      aria-disabled={ariaDisabled}
      aria-pressed={ariaPressed}
      classNames={computed}
    />
  );
}
