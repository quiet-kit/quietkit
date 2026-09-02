import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { ROUTES } from './routes-manifest';

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={<route.element />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
