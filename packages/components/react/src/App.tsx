import { Link, Route, Routes } from 'react-router';
import './App.css';
import '../../../web-builder/build/kiskadee.css';
import Button from './components/Button';
import Text from './components/Text';

function App() {
  return (
    <>
      <h1>Componentes</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/button">Button</Link>
        <Link to="/text">Text</Link>
      </nav>

      <Routes>
        <Route path="/button" element={<Button />} />
        <Route path="/text" element={<Text />} />
        <Route path="/" element={<p>Escolha um componente acima.</p>} />
      </Routes>
    </>
  );
}

export default App;
