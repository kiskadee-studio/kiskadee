import { Link, Route, Routes } from 'react-router';
import './App.css';

import { useStyleClasses } from './contexts/StyleClassesContext';
import ButtonPage from './pages/Button';
import TabsPage from './pages/Tabs';
import TextPage from './pages/Text';

function App() {
  // TODO: rename it with useKiskadee()
  const { palette, setPalette } = useStyleClasses();

  return (
    <>
      <h1>Componentes</h1>
      {/* Palette selector */}
      <div style={{ padding: 12 }}>
        <label>
          Palheta de cores:
          <select
            value={palette}
            onChange={(e) => setPalette(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="p1">p1</option>
            <option value="p2">p2</option>
            <option value="p3">p3</option>
          </select>
        </label>
      </div>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/button">Button</Link>
        <Link to="/text">Text</Link>
        <Link to="/tabs">Tabs</Link>
      </nav>

      <Routes>
        <Route path="/button" element={<ButtonPage />} />
        <Route path="/text" element={<TextPage />} />
        <Route path="/tabs" element={<TabsPage />} />
        <Route path="/" element={<p>Escolha um componente acima.</p>} />
      </Routes>
    </>
  );
}

export default App;
