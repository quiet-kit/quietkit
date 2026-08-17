import { Routes, Route, Navigate } from 'react-router';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Privacy from './pages/Privacy';
import RedactPdf from './pages/RedactPdf';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/pdf/redact" element={<RedactPdf />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
