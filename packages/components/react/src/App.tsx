import { Link, Route, Routes } from 'react-router';
import './App.css';
import ButtonPage from './pages/Button';
import TextPage from './pages/Text';
import TabsPage from './pages/Tabs';

function App() {
  return (
    <>
      <h1>Componentes</h1>
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
