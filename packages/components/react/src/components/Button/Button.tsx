import type { ButtonProps as HeadlessButtonProps } from '@kiskadee/react-headless';
import { Button as HeadlessButton } from '@kiskadee/react-headless';
import {
  type ClassNameByElementJSON,
  stateActivator as cn,
  type ElementSizeValue,
  type StateActivatorKeys
} from '@kiskadee/schema';
import { memo, useMemo } from 'react';
import { useKiskadee } from '../../contexts/KiskadeeContext.tsx';
import './Button.scss';

export type ButtonStatus = Exclude<StateActivatorKeys, 'selected' | 'shadow'>;
export type ButtonProps = HeadlessButtonProps & {
  /** Force Kiskadee visual/interaction state on the root element (e1). Excludes 'selected' and 'shadow'. */
  status?: ButtonStatus;
  /** Marks this button as a semantic toggle (Following vs. Follow). */
  toggle?: boolean;
  /** Semantic control state (selected/active/checked). When true, selected styles are applied. */
  controlState?: boolean;
  /**
   * Force size/scale for the root element (e1).
   * If not provided, Button defaults to the median scale 's:md:1'.
   */
  scale?: ElementSizeValue;
  /** Enable elevation/shadow visuals. When true, adds the shadow activation class. */
  shadow?: boolean;
};

// Build a single space-separated class string from flattened d/p only (sizes handled in e1)
function collectStr(el: ClassNameByElementJSON | undefined): string {
  if (!el) return '';
  let out = '';
  if (el.d) out = el.d;
  const p = el.p;
  if (p) out = out ? `${out} ${p}` : p;
  return out;
}

function Button(props: ButtonProps) {
  const {
    classNames = {},
    status = 'rest',
    toggle,
    controlState,
    scale = 's:md:1',
    disabled,
    shadow = false,
    tabIndex,
    ...restProps
  } = props;
  const {
    // e1 (root), e2 (label), e3 (icon)
    classesMap: { button: { e1, e2, e3 } = {} }
  } = useKiskadee();

  // Note: We always apply 's:all' and a size-specific scale.
  // If no `scale` prop is passed, we default to the median 's:md:1' so the button never renders without a scale.

  const computed = useMemo<NonNullable<HeadlessButtonProps['classNames']>>(() => {
    const el1 = collectStr(e1);
    const el2 = collectStr(e2);
    const el3 = collectStr(e3);

    // Include scales for e1 (root) and e2 (label)
    const sAllE1 = e1?.s?.['s:all'] ?? '';
    const sScaleE1 = e1?.s?.[scale] ?? '';
    const sAllE2 = e2?.s?.['s:all'] ?? '';
    const sScaleE2 = e2?.s?.[scale] ?? '';

    // Effects base classes (from Phase 5 `e`) — unified string.
    // We append them unconditionally; activation is governed by forced state classes or native pseudos in CSS.
    const e1Effects = e1?.e ?? '';

    const e1Base =
      (el1 ? `${el1}` : '') +
      (sAllE1 ? ` ${sAllE1}` : '') +
      (classNames.e1 ? ` ${classNames.e1}` : '') +
      (sScaleE1 ? ` ${sScaleE1}` : '') +
      (e1Effects ? ` ${e1Effects}` : '');

    const e2Base =
      (el2 ? `${el2}` : '') +
      (sAllE2 ? ` ${sAllE2}` : '') +
      (classNames.e2 ? ` ${classNames.e2}` : '') +
      (sScaleE2 ? ` ${sScaleE2}` : '');

    const e3Base = (el3 || '') + (classNames.e3 ? (el3 ? ' ' : '') + classNames.e3 : '');

    // Forced activation classes (status + selected) built via direct concatenation
    let activation = '';
    if (status !== 'rest') {
      const forced = cn[status];
      if (forced) activation += ` ${forced}`;
    }
    if (controlState) activation += ` ${cn.selected}`;
    if (activation) activation += ` ${cn.activator}`;

    // Shadow activation flag (does not imply activator -a)
    const shadowFlag = shadow ? ` ${cn.shadow}` : '';

    return {
      e1: `${e1Base}${shadowFlag}${activation} btn kd-transition`,
      e2: e2Base,
      e3: e3Base
    };
  }, [
    e1,
    e2,
    e3,
    status,
    controlState,
    scale,
    shadow,
    classNames.e1,
    classNames.e2,
    classNames.e3
  ]);

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
      // Safari (macOS and iOS) requires tabIndex to support focus
      tabIndex={tabIndex ?? 0}
    />
  );
}

const MemoButton = memo(Button);
export { MemoButton as Button };
