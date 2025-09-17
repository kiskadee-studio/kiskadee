import type { ButtonProps as HeadlessButtonProps } from '@kiskadee/react-headless';
import { Button as HeadlessButton } from '@kiskadee/react-headless';
import { classNameCssPseudoSelector } from '@kiskadee/schema';
import { useMemo } from 'react';
import { useStyleClasses } from '../contexts/StyleClassesContext';

export type ButtonStatus = keyof typeof classNameCssPseudoSelector;
export type ButtonProps = HeadlessButtonProps & {
  /** Force Kiskadee visual/interaction state on the root element (e1). */
  status?: ButtonStatus;
  /** Marks this button as a semantic toggle (Following vs Follow). */
  toggle?: boolean;
};

export default function Button(props: ButtonProps) {
  const { classNames: userClassNames, status = 'rest', toggle, ...rest } = props;
  const { classesMap, palette } = useStyleClasses();

  const computed = useMemo<NonNullable<HeadlessButtonProps['classNames']>>(() => {
    const pal = palette;
    const e1 = classesMap?.button?.e1; // element e1: root
    const e2 = classesMap?.button?.e2; // element e2: label
    const e3 = classesMap?.button?.e3; // element e3: icon

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
    // - Exception (disabled): the "disabled" state does not need the activator "-a" because, unlike
    //   other states that cannot be forced natively, an element can be programmatically disabled. Doing so
    //   naturally triggers the native ":disabled" selector. For this reason we deliberately skip appending
    //   any forced classes when status === 'disabled'.
    // - Here we append both the forced state class (e.g., -h, -f, -s, etc.) and the activator -a
    //   to the root element when a non-rest/non-disabled status is requested, so the previewed
    //   component visually matches that state even without user interaction.
    // pseudoDisabled, selected, readOnly are not natively supported by buttons
    const activationClasses =
      status === 'pseudoDisabled' || status === 'selected' || status === 'readOnly'
        ? ` ${classNameCssPseudoSelector[status as keyof typeof classNameCssPseudoSelector]} -a`
        : '';

    return {
      ...base,
      e1: `${base.e1}${activationClasses}`
    };
  }, [classesMap, palette, userClassNames, status]);

  // Map Kiskadee status to native/ARIA attributes
  const disabled = rest.disabled ?? (status === 'disabled' ? true : undefined);
  const ariaDisabled = rest['aria-disabled'] ?? (status === 'pseudoDisabled' ? true : undefined);
  const ariaPressed = rest['aria-pressed'] ?? (toggle && status === 'selected' ? true : undefined);

  return (
    <HeadlessButton
      {...rest}
      disabled={disabled}
      aria-disabled={ariaDisabled}
      aria-pressed={ariaPressed}
      classNames={computed}
    />
  );
}
