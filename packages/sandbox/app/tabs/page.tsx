import { Tabs, type TabItem } from '@kiskadee/react-components';

const items: TabItem[] = [
  { id: 'a', label: 'Tab A', content: <div>Content A</div> },
  { id: 'b', label: 'Tab B', content: <div>Content B</div> }
];

export default function TabsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Tabs</h1>
      <Tabs items={items} />
    </main>
  );
}
