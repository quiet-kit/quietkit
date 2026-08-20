const GA_ID =
  typeof import.meta.env !== 'undefined'
    ? (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)
    : undefined;
const CONSENT_KEY = 'cookie-consent';
const LOADED_FLAG = '__quietkitGaLoaded';

export type Consent = 'accepted' | 'declined' | null;

/**
 * Read the user's cookie consent choice from localStorage.
 */
export function getConsent(): Consent {
  try {
    return localStorage.getItem(CONSENT_KEY) as Consent;
  } catch {
    return null;
  }
}

/**
 * Persist the user's choice and initialize GA only if accepted.
 */
export function setConsent(value: Consent): void {
  try {
    if (value) {
      localStorage.setItem(CONSENT_KEY, value);
    } else {
      localStorage.removeItem(CONSENT_KEY);
    }
  } catch {
    // Ignore environments where localStorage is unavailable.
  }

  if (value === 'accepted') {
    initGA();
  }
}

/**
 * Dynamically inject the Google Analytics script and configure gtag.
 * Safe to call multiple times — guarded by LOADED_FLAG.
 */
function initGA(): void {
  if (!GA_ID || typeof window === 'undefined') {
    return;
  }

  const win = window as typeof window & {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    [LOADED_FLAG]?: boolean;
  };

  if (win[LOADED_FLAG]) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  win.dataLayer = win.dataLayer || [];
  function gtag(...args: unknown[]) {
    win.dataLayer.push(args);
  }
  win.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  win[LOADED_FLAG] = true;
}

/**
 * Track a GA event if the user has accepted analytics.
 */
export function gaEvent(action: string, params?: Record<string, unknown>): void {
  if (getConsent() !== 'accepted') return;

  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', action, params);
  }
}
