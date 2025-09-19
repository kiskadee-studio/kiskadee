import Button from '../components/Button';

export default function ButtonPage() {
  return (
    <section>
      <h2>Button</h2>
      <p>Exemplo simples do componente Button:</p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button label="Button" onClick={() => alert('Button clicado!')} />
        <Button
          label="Com ícone"
          icon={<span aria-hidden>⭐</span>}
          onClick={() => alert('Com ícone')}
        />
        <Button
          aria-label="Icon only"
          icon={<span aria-hidden>🔔</span>}
          onClick={() => alert('Somente ícone')}
        />
        <Button label="Rest" />
        <Button label="Hover" status="hover" />
        <Button label="Focus" status="focus" />
        <Button label="Pressed" status="pressed" />
        <Button label="Disabled" status="disabled" />
        <Button label="Aria Disabled (visual only)" status="disabled" aria-disabled />
      </div>
    </section>
  );
}
