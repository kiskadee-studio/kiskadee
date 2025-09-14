import Tabs, { type TabItem } from '../components/Tabs';

export default function TabsPage() {
  const items: TabItem[] = [
    {
      id: 'geral',
      label: 'Geral',
      content: (
        <div>
          <h3>Configurações gerais</h3>
          <p>Conteúdo do painel de abas "Geral".</p>
        </div>
      )
    },
    {
      id: 'detalhes',
      label: 'Detalhes',
      content: (
        <div>
          <h3>Detalhes</h3>
          <p>Informações detalhadas e exemplos de conteúdo.</p>
        </div>
      )
    },
    {
      id: 'avancado',
      label: 'Avançado',
      content: (
        <div>
          <h3>Configurações avançadas</h3>
          <p>Opções avançadas. Esta aba começa desabilitada como exemplo.</p>
        </div>
      ),
      disabled: true
    }
  ];

  return (
    <section>
      <h2>Tabs</h2>
      <p>Exemplos de uso das abas com dados preenchidos.</p>

      <div style={{ marginBottom: 16 }}>
        <h3>Modo automático (padrão)</h3>
        <Tabs
          idPrefix="example1"
          items={items}
          orientation="horizontal"
          activationMode="automatic"
          defaultValue="geral"
        />
      </div>

      <div>
        <h3>Modo manual</h3>
        <p>Use Enter/Espaço para ativar a aba focada.</p>
        <Tabs
          idPrefix="example2"
          items={items.map((i) => ({ ...i, disabled: i.id === 'avancado' }))}
          orientation="horizontal"
          activationMode="manual"
          defaultValue="detalhes"
        />
      </div>
    </section>
  );
}
