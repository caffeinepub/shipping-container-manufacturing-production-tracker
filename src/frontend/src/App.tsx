import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import ProductionHistoryPage from './pages/ProductionHistoryPage';
import ProductionDashboardPage from './pages/ProductionDashboardPage';
import ContainerDailyReportPage from './pages/ContainerDailyReportPage';
import ContainerDailyReportEntryPage from './pages/ContainerDailyReportEntryPage';
import AuthGuard from './components/AuthGuard';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <AuthGuard>
      <ProductionDashboardPage />
    </AuthGuard>
  ),
});

const productionDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/production-dashboard',
  component: () => (
    <AuthGuard>
      <ProductionDashboardPage />
    </AuthGuard>
  ),
});

const productionHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/production-history',
  component: () => (
    <AuthGuard>
      <ProductionHistoryPage />
    </AuthGuard>
  ),
});

const containerDailyReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/container-daily-report',
  component: () => (
    <AuthGuard>
      <ContainerDailyReportPage />
    </AuthGuard>
  ),
});

const containerDailyReportEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/container-daily-report-entry',
  component: () => (
    <AuthGuard>
      <ContainerDailyReportEntryPage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productionDashboardRoute,
  productionHistoryRoute,
  containerDailyReportRoute,
  containerDailyReportEntryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
