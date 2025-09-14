import { useMemo } from 'react';
import { useStyleClasses } from '../contexts/StyleClassesContext';

export default function Button() {
  const { classesMap, palette } = useStyleClasses();

  const buttonClassName = useMemo(() => {
    const parts: string[] = [];
    const e1 = classesMap?.button?.['e1'];
    const e2 = classesMap?.button?.['e2'];

    if (e1?.decorations) parts.push(...e1.decorations);
    if (e1?.palettes?.[palette]?.primary?.rest) parts.push(...e1.palettes[palette]!.primary!.rest!);
    if (e2?.palettes?.[palette]?.primary?.rest) parts.push(...e2.palettes[palette]!.primary!.rest!);

    return parts.join(' ');
  }, [classesMap, palette]);

  const handleClick = () => {
    // Demonstrate access to the global classes map
    // In the next steps we'll use it to style the component
    console.log('[Button] classesMap', classesMap, 'palette', palette);
    alert('Button clicado!');

    console.log(classesMap?.button?.e1?.palettes?.[palette]?.primary?.rest);
  };

  return (
    <button type="button" onClick={handleClick} className={buttonClassName}>
      Button
    </button>
  );
}

/*
 * TODO: The button's border-style should be "none" by default, otherwise it will load the browser's default border
 */
