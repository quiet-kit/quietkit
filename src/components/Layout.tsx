import { Link, useLocation } from "react-router";
import { VolumeX, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CookieConsent } from "@/components/CookieConsent";

const nav = [
  { path: "/", label: "Home" },
  { path: "/tools", label: "Tools" },
  { path: "/pdf/redact", label: "Redact PDF" },
  { path: "/privacy", label: "Privacy" },
];

const footerNav = [
  { path: "/tools", label: "Tools" },
  { path: "/pdf/redact", label: "Redact PDF" },
  { path: "/privacy", label: "Privacy" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <VolumeX className="w-5 h-5 text-blue-600" />
            <span>QuietKit</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Badge variant="outline" className="ml-2 font-mono text-xs">
              0 bytes uploaded
            </Badge>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Badge variant="outline" className="font-mono text-xs">
              0 bytes uploaded
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-3">
              {nav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-sm font-medium",
                    location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {footerNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p>Free. No uploads. No sign-ups. Analytics only with your consent.</p>
          <p>&copy; {new Date().getFullYear()} QuietKit</p>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
}
