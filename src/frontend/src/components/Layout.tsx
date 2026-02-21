import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Factory, Activity, FileText, FileSpreadsheet, History } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerRole } from '../hooks/useGetCallerRole';
import { SiCoffeescript } from 'react-icons/si';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { identity } = useInternetIdentity();
  const { data: role } = useGetCallerRole();
  const isAuthenticated = !!identity;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = role === 'admin';

  const allNavItems = [
    { path: '/production-dashboard', label: 'Live Dashboard', icon: Activity },
    { path: '/container-daily-report', label: 'Daily Report', icon: FileText },
    { path: '/container-daily-report-entry', label: 'Report Entry', icon: FileSpreadsheet, adminOnly: true },
    { path: '/production-history', label: 'Production History', icon: History },
  ];

  const navItems = isAdmin 
    ? allNavItems
    : allNavItems.filter(item => !item.adminOnly);

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Factory className="h-8 w-8 text-primary" />
              <div className="h-8 w-1 bg-primary"></div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight tracking-tight">
                  Container Manufacturing
                </h1>
                <p className="text-xs text-primary uppercase tracking-wider font-medium">
                  Production Intelligence
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path || (currentPath === '/' && item.path === '/production-dashboard');
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}

            <div className="flex items-center gap-2">
              <LoginButton />
              {isAuthenticated && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-md hover:bg-accent"
                >
                  {mobileMenuOpen ? <span className="text-xl">✕</span> : <span className="text-xl">☰</span>}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isAuthenticated && mobileMenuOpen && (
            <nav className="md:hidden border-t border-border py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (currentPath === '/' && item.path === '/production-dashboard');
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Container Manufacturing Production Intelligence System</p>
            <p className="flex items-center gap-1">
              Built with <SiCoffeescript className="h-4 w-4 text-destructive" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
