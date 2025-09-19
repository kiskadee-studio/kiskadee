import type { ButtonProps as HeadlessButtonProps } from '@kiskadee/react-headless';
import { Button as HeadlessButton } from '@kiskadee/react-headless';
import { classNameCssPseudoSelector as cn } from '@kiskadee/schema';
import { useMemo } from 'react';
import { useStyleClasses } from '../contexts/StyleClassesContext';

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
    classesMap: { button },
    palette
  } = useStyleClasses();

  const computed = useMemo<NonNullable<HeadlessButtonProps['classNames']>>(() => {
    const pal = palette;
    const e1 = button?.e1; // element e1: root
    const e2 = button?.e2; // element e2: label
    const e3 = button?.e3; // element e3: icon

    const rootParts: string[] = [];
    if (e1?.decorations) rootParts.push(...e1.decorations);
    // TODO: tratar diferentes tamanhos
    if (e1?.scales?.['s:all']) rootParts.push(...e1.scales['s:all']);
    // TODO: unificar todas as classes simples numa string só
    // TODO: [WP] Todos os estados de suporte nativos devem ser unificados
    // TODO: [WP] Tratar quando forem estados não nativos
    // TODO: Tratar quando for para forçar estado nativo sem evento nativo
    // TODO: extrair as paletas em arquivos diferentes
    // TODO: onde vão ficar estilos fixos dos componentes?

    // rest, hover, pressed, focus, disabled são todos os estados nativos
    if (e1?.palettes?.[pal]?.primary?.rest) rootParts.push(...e1.palettes[pal].primary.rest);
    if (e1?.palettes?.[pal]?.primary?.hover) rootParts.push(...e1.palettes[pal].primary.hover);
    if (e1?.palettes?.[pal]?.primary?.pressed) rootParts.push(...e1.palettes[pal].primary.pressed);
    if (e1?.palettes?.[pal]?.primary?.focus) rootParts.push(...e1.palettes[pal].primary.focus);
    if (e1?.palettes?.[pal]?.primary?.disabled)
      rootParts.push(...e1.palettes[pal].primary.disabled);

    const labelParts: string[] = [];
    if (e2?.decorations) labelParts.push(...e2.decorations);
    if (e2?.scales?.['s:all']) labelParts.push(...e2.scales['s:all']);
    if (e2?.palettes?.[pal]?.primary?.rest) labelParts.push(...e2.palettes[pal].primary.rest);

    const iconParts: string[] = [];
    if (e3?.decorations) iconParts.push(...e3.decorations);
    if (e3?.palettes?.[pal]?.primary?.rest) iconParts.push(...e3.palettes[pal].primary.rest);

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
  }, [button, palette, userClassNames, status]);

  // Map Kiskadee status to native/ARIA attributes
  // Behavior:
  // - If consumer passes `disabled`, always respect it.
  // - Else if `status === 'disabled'` and consumer explicitly passes `aria-disabled={true}`,
  //   do NOT set the native `disabled` attribute (keep it interactive), but keep visual classes.
  // - Else if `status === 'disabled'`, set `disabled={true}` (native disabled).
  const ariaDisabled = restProps['aria-disabled'];
  const disabled =
    d !== undefined
      ? d
      : status === 'disabled' && ariaDisabled === true
        ? undefined
        : status === 'disabled'
          ? true
          : undefined;

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
