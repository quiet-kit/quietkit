import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getConsent, setConsent, loadAnalyticsIfConsented } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function CookieConsent() {
  const [visible, setVisible] = useState(() => getConsent() === null);

  useEffect(() => {
    loadAnalyticsIfConsented();
  }, []);

  const handleAccept = () => {
    setConsent('accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    setConsent('declined');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80',
        'sm:px-6 lg:px-8'
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          We use cookies only for Google Analytics to understand how you use the site,
          improve your experience, develop new features, and support localization.
        </p>
        <div className="flex shrink-0 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDecline}
            className="min-h-11 min-w-[88px]"
          >
            Decline
          </Button>
          <Button
            type="button"
            onClick={handleAccept}
            className="min-h-11 min-w-[88px]"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
