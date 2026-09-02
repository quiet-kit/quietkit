import { type ComponentType, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Tools = lazy(() => import('./pages/Tools'));
const Privacy = lazy(() => import('./pages/Privacy'));
const RedactPdf = lazy(() => import('./pages/RedactPdf'));
const RedactBankStatement = lazy(() => import('./pages/scenarios/RedactBankStatement'));
const RedactSsn = lazy(() => import('./pages/scenarios/RedactSsn'));
const RedactMedicalRecords = lazy(() => import('./pages/scenarios/RedactMedicalRecords'));

export interface RouteManifestItem {
  path: string;
  label: string;
  priority: number;
  changefreq: string;
  element: ComponentType;
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
