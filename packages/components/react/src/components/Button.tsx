import type { ButtonProps as HeadlessButtonProps } from '@kiskadee/react-headless';
import { Button as HeadlessButton } from '@kiskadee/react-headless';
import { type ClassNameByElementJSON, classNameCssPseudoSelector as cn } from '@kiskadee/schema';
import { useMemo } from 'react';
import { useKiskadee } from '../contexts/KiskadeeContext.tsx';

export type ButtonStatus = keyof typeof cn;
export type ButtonProps = HeadlessButtonProps & {
  /** Force Kiskadee visual/interaction state on the root element (e1). */
  status?: ButtonStatus;
  /** Marks this button as a semantic toggle (Following vs. Follow). */
  toggle?: boolean;
};

export default function Button(props: ButtonProps) {
  const { classNames = {}, status = 'rest', toggle, disabled, ...restProps } = props;
  const {
    // e1 (root), e2 (label), e3 (icon)
    classesMap: { button: { e1, e2, e3 } = {} }
  } = useKiskadee();

  const computed = useMemo<NonNullable<HeadlessButtonProps['classNames']>>(() => {
    // Helper to collect class parts for each element across all interaction states
    const collect = (el: ClassNameByElementJSON): string[] => {
      const parts: string[] = [];
      if (!el) return parts;
      if (el.d) parts.push(...el.d);
      if (el.s?.['s:all']) parts.push(...(el.s['s:all'] as string[]));
      const p = el.p?.primary;
      if (p?.rest) parts.push(...p.rest);
      if (p?.hover) parts.push(...p.hover);
      if (p?.pressed) parts.push(...p.pressed);
      if (p?.focus) parts.push(...p.focus);
      if (p?.disabled) parts.push(...p.disabled);
      if (p?.selected) parts.push(...p.selected);
      return parts;
    };

    const rootParts = collect(e1);
    const labelParts = collect(e2);
    const iconParts = collect(e3);

    type CN = NonNullable<HeadlessButtonProps['classNames']>;
    const join = (baseParts: string[], key: keyof CN) =>
      `${baseParts.join(' ')} ${classNames[key] ?? ''}`.trim();

    const base = {
      e1: join(rootParts, 'e1'),
      e2: join(labelParts, 'e2'),
      e3: join(iconParts, 'e3')
    } as const;

    // Activator pattern for forced states applies to the root (e1) only.
    const shouldForce = status !== 'rest' && cn[status] !== '';
    const activationClasses = shouldForce ? ` ${cn[status]} -a` : '';

    return {
      ...base,
      e1: `${base.e1}${activationClasses}`
    };
  }, [e1, e2, e3, status, classNames]);

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
    restProps['aria-pressed'] ?? (toggle && status === 'selected' ? true : undefined);

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
