import type { ReactNode } from 'react';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Privacy from './pages/Privacy';
import RedactPdf from './pages/RedactPdf';
import RedactBankStatement from './pages/scenarios/RedactBankStatement';
import RedactSsn from './pages/scenarios/RedactSsn';
import RedactMedicalRecords from './pages/scenarios/RedactMedicalRecords';

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
  { path: '/pdf/redact-bank-statement', label: 'Redact Bank Statement', priority: 0.8, changefreq: 'weekly', element: RedactBankStatement },
  { path: '/pdf/redact-ssn', label: 'Redact SSN', priority: 0.8, changefreq: 'weekly', element: RedactSsn },
  { path: '/pdf/redact-medical-records', label: 'Redact Medical Records', priority: 0.8, changefreq: 'weekly', element: RedactMedicalRecords },
];
