import { Link, Route, Routes } from 'react-router';
import './App.css';

import BackgroundTonePicker from './components/BackgroundTonePicker';
import DesignSystemControls from './components/DesignSystemControls';
import ThemeModePicker from './components/ThemeModePicker/ThemeModePicker.tsx';
import ButtonPage from './pages/Button/Button.tsx';
import TabsPage from './pages/Tabs';
import TextPage from './pages/Text';

function App() {
  return (
    <>
      <DesignSystemControls />
      <div
        style={{ position: 'fixed', right: 12, top: 12, display: 'flex', gap: 8, zIndex: 10000 }}
      >
        <ThemeModePicker position="inline" />
        <BackgroundTonePicker position="inline" />
      </div>
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
