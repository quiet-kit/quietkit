import type { ReactNode } from 'react';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Privacy from './pages/Privacy';
import RedactPdf from './pages/RedactPdf';

export interface RouteManifestItem {
  path: string;
  label: string;
  priority: number;
  changefreq: string;
  element: () => ReactNode;
}

export const ROUTES: RouteManifestItem[] = [
  { path: '/', label: 'Home', priority: 1.0, changefreq: 'weekly', element: Home },
  { path: '/tools', label: 'Tools', priority: 0.8, changefreq: 'weekly', element: Tools },
  { path: '/privacy', label: 'Privacy', priority: 0.4, changefreq: 'monthly', element: Privacy },
  { path: '/pdf/redact', label: 'Redact PDF', priority: 0.9, changefreq: 'weekly', element: RedactPdf },
];
