import { Routes, Route, Navigate } from 'react-router';
import { ROUTES } from './routes-manifest';

export default function App() {
  return (
    <Routes>
      {ROUTES.map((route) => (
        <Route key={route.path} path={route.path} element={<route.element />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
