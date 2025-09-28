import type { ButtonProps as HeadlessButtonProps } from '@kiskadee/react-headless';
import { Button as HeadlessButton } from '@kiskadee/react-headless';
import { type ClassNameByElementJSON, classNameCssPseudoSelector as cn } from '@kiskadee/schema';
import { memo, useMemo } from 'react';
import { useKiskadee } from '../../contexts/KiskadeeContext.tsx';
import './Button.scss';

export type ButtonStatus = Exclude<keyof typeof cn, 'selected'>;
export type ButtonProps = HeadlessButtonProps & {
  /** Force Kiskadee visual/interaction state on the root element (e1). Excludes 'selected'. */
  status?: ButtonStatus;
  /** Marks this button as a semantic toggle (Following vs. Follow). */
  toggle?: boolean;
  /** Semantic control state (selected/active/checked). When true, selected styles are applied. */
  controlState?: boolean;
};

// Build a single space-separated class string from flattened d/p and s['s:all']
function collectStr(el: ClassNameByElementJSON | undefined): string {
  if (!el) return '';
  let out = '';
  if (el.d) out = el.d;
  const sAll = el.s?.['s:all'];
  if (sAll?.length) out = out ? `${out} ${sAll.join(' ')}` : sAll.join(' ');
  const p = el.p;
  if (p) out = out ? `${out} ${p}` : p;
  return out;
}

function Button(props: ButtonProps) {
  const { classNames = {}, status = 'rest', toggle, controlState, disabled, ...restProps } = props;
  const {
    // e1 (root), e2 (label), e3 (icon)
    classesMap: { button: { e1, e2, e3 } = {} }
  } = useKiskadee();

  const computed = useMemo<NonNullable<HeadlessButtonProps['classNames']>>(() => {
    const el1 = collectStr(e1);
    const el2 = collectStr(e2);
    const el3 = collectStr(e3);

    // Base strings with optional consumer overrides (no arrays, no trims)
    const e1Base = (el1 ? ` ${el1}` : '') + (classNames.e1 ? ` ${classNames.e1}` : '');
    const e2Base = (el2 || '') + (classNames.e2 ? (el2 ? ' ' : '') + classNames.e2 : '');
    const e3Base = (el3 || '') + (classNames.e3 ? (el3 ? ' ' : '') + classNames.e3 : '');

    // Forced activation classes (status + selected) built via direct concatenation
    let activation = '';
    if (status !== 'rest') {
      const forced = cn[status];
      if (forced) activation += ` ${forced}`;
    }
    if (controlState) activation += ` ${cn.selected}`;
    if (activation) activation += ' -a';

    return {
      e1: `${e1Base + activation} btn kd-transition`,
      e2: e2Base,
      e3: e3Base
    };
  }, [e1, e2, e3, status, controlState, classNames.e1, classNames.e2, classNames.e3]);

  // Map Kiskadee status to native/ARIA attributes
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

const MemoButton = memo(Button);
export { MemoButton as Button };
