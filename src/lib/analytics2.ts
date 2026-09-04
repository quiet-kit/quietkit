import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getConsent } from '@/lib/analytics';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Tracks page views for Google Analytics 4 on every client-side route change.
 * The GA4 script is loaded from index.html only when VITE_GA_MEASUREMENT_ID is set.
 */
export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const consent = getConsent();
    if (consent != 'accepted') return;

    if (!GA_ID || typeof window.gtag !== 'function') return;
    console.log("[analytics] start analytics")

    window.gtag('config', GA_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);
}
