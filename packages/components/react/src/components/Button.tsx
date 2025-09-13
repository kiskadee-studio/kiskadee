import { useStyleClasses } from '../contexts/StyleClassesContext';

export default function Button() {
  const classesMap = useStyleClasses();

  const handleClick = () => {
    // Demonstrate access to the global classes map
    // In the next steps we'll use it to style the component
    console.log('[Button] classesMap', classesMap);
    alert('Button clicado!');
  };

  return (
    <button type="button" onClick={handleClick}>
      Button
    </button>
  );
}
