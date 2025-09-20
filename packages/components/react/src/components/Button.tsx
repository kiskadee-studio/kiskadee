import type { ButtonProps as HeadlessButtonProps } from '@kiskadee/react-headless';
import { Button as HeadlessButton } from '@kiskadee/react-headless';
import { classNameCssPseudoSelector as cn } from '@kiskadee/schema';
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
  const { classNames: userClassNames, status = 'rest', toggle, disabled: d, ...restProps } = props;
  const {
    // e1 (root), e2 (label), e3 (icon)
    classesMap: { button: { e1, e2, e3 } = {} }
  } = useKiskadee();

  const computed = useMemo<NonNullable<HeadlessButtonProps['classNames']>>(() => {
    const rootParts: string[] = [];
    if (e1?.d) rootParts.push(...e1.d);
    // TODO: tratar diferentes tamanhos
    if (e1?.s?.['s:all']) rootParts.push(...(e1.s['s:all'] as string[]));
    // TODO: unificar todas as classes simples numa string só
    // TODO: [WP] Todos os estados de suporte nativos devem ser unificados
    // TODO: [WP] Tratar quando forem estados não nativos
    // TODO: Tratar quando for para forçar estado nativo sem evento nativo
    // TODO: extrair as paletas em arquivos diferentes
    // TODO: onde vão ficar estilos fixos dos componentes?

    // rest, hover, pressed, focus, disabled são todos os estados nativos
    if (e1?.p?.primary?.rest) rootParts.push(...e1.p.primary.rest);
    if (e1?.p?.primary?.hover) rootParts.push(...e1.p.primary.hover);
    if (e1?.p?.primary?.pressed) rootParts.push(...e1.p.primary.pressed);
    if (e1?.p?.primary?.focus) rootParts.push(...e1.p.primary.focus);
    if (e1?.p?.primary?.disabled) rootParts.push(...e1.p.primary.disabled);

    const labelParts: string[] = [];
    if (e2?.d) labelParts.push(...e2.d);
    if (e2?.s?.['s:all']) labelParts.push(...(e2.s['s:all'] as string[]));
    if (e2?.p?.primary?.rest) labelParts.push(...e2.p.primary.rest);

    const iconParts: string[] = [];
    if (e3?.d) iconParts.push(...e3.d);
    if (e3?.p?.primary?.rest) iconParts.push(...e3.p.primary.rest);

    // TODO: what is "u"?
    const u = userClassNames ?? {};
    type CN = NonNullable<HeadlessButtonProps['classNames']>;
    const join = (baseParts: string[], key: keyof CN) =>
      `${baseParts.join(' ')} ${u[key] ?? ''}`.trim();

    const base = {
      e1: join(rootParts, 'e1'),
      e2: join(labelParts, 'e2'),
      e3: join(iconParts, 'e3')
    } as const;

    // Activator pattern for forced states:
    // - Kiskadee generates two forms of state selectors for colors and similar rules:
    //   1) Native pseudo-class (e.g., :hover)
    //   2) A forced class (e.g., -h for hover) that can emulate the state without a real event
    // - To avoid the forced class applying styles unintentionally just by being present in the DOM,
    //   all forced selectors are gated by an activator class "-a". This means:
    //     .<class>:hover, .<class>.-h.-a { ... }
    //   or, for parent-driven refs:
    //     .-a:hover .<class>, .-a.-h .<class> { ... }
    // Update: Disabled visuals are now applied via activator class instead of :disabled.
    // We always gate forced visuals with the activator "-a" to avoid accidental activation.
    const shouldForce = status !== 'rest' && cn[status] !== '';
    const activationClasses = shouldForce ? ` ${cn[status]} -a` : '';

    return {
      ...base,
      e1: `${base.e1}${activationClasses}`
    };
  }, [e1, e2, e3, status, userClassNames]);

  // Map Kiskadee status to native/ARIA attributes
  // Current behavior:
  // - If the consumer passes `disabled`, we use that value as-is (takes precedence over `status`).
  // - Else if `status === 'disabled'`:
  //     - When `aria-disabled === true`, do NOT set the native `disabled` attribute (element remains interactive).
  //       Visual "disabled" styling is still forced via the activator classes added above.
  //     - Otherwise set `disabled={true}` to use the native disabled state.
  // - In any other case, we leave `disabled` undefined.
  const ariaDisabled = restProps['aria-disabled'];
  let disabled: boolean | undefined;
  if (d !== undefined) {
    // Always respect the consumer-provided `disabled` prop
    disabled = d;
  } else if (status === 'disabled') {
    // If aria-disabled is explicitly true, keep the element interactive
    disabled = ariaDisabled === true ? undefined : true;
  } else {
    disabled = undefined;
  }

  const ariaPressed =
    restProps['aria-pressed'] ?? (toggle && status === 'selected' ? true : undefined);

  return (
    <HeadlessButton
      {...restProps}
      disabled={disabled}
      aria-disabled={ariaDisabled}
      aria-pressed={ariaPressed}
      classNames={computed}
    />
  );
}
