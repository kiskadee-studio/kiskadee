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
  const { classNames: userClassNames, status, toggle, ...rest } = props;
  const { classesMap, palette } = useStyleClasses();

  const computed = useMemo<NonNullable<HeadlessButtonProps['classNames']>>(() => {
    const pal = palette;
    const e1 = classesMap?.button?.e1; // element e1: root
    const e2 = classesMap?.button?.e2; // element e2: label
    const e3 = classesMap?.button?.e3; // element e3: icon

    const rootParts: string[] = [];
    if (e1?.decorations) rootParts.push(...e1.decorations);
    if (e1?.scales?.['s:all']) rootParts.push(...e1.scales['s:all']);
    if (e1?.palettes?.[pal]?.primary?.rest) rootParts.push(...e1.palettes[pal].primary.rest);

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

    const suffix = status ? classNameCssPseudoSelector[status] : '';

    return {
      ...base,
      e1: `${base.e1} ${suffix}`.trim()
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
