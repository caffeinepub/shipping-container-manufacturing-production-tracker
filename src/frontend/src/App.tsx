import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ProductionEntryPage from './pages/ProductionEntryPage';
import ProductionHistoryPage from './pages/ProductionHistoryPage';
import DispatchTrackingPage from './pages/DispatchTrackingPage';
import WorkInHandPage from './pages/WorkInHandPage';
import DailyProductionReportPage from './pages/DailyProductionReportPage';
import ProductionDashboardPage from './pages/ProductionDashboardPage';
import ContainerDailyReportPage from './pages/ContainerDailyReportPage';
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
      <DashboardPage />
    </AuthGuard>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AuthGuard>
      <DashboardPage />
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

const productionEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/production/entry',
  component: () => (
    <AuthGuard>
      <ProductionEntryPage />
    </AuthGuard>
  ),
});

const productionHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/production/history',
  component: () => (
    <AuthGuard>
      <ProductionHistoryPage />
    </AuthGuard>
  ),
});

const productionHistoryAltRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/production-history',
  component: () => (
    <AuthGuard>
      <ProductionHistoryPage />
    </AuthGuard>
  ),
});

const dispatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dispatch',
  component: () => (
    <AuthGuard>
      <DispatchTrackingPage />
    </AuthGuard>
  ),
});

const workInHandRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/work-in-hand',
  component: () => (
    <AuthGuard>
      <WorkInHandPage />
    </AuthGuard>
  ),
});

const dailyProductionReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-production-report',
  component: () => (
    <AuthGuard>
      <DailyProductionReportPage />
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  productionDashboardRoute,
  productionEntryRoute,
  productionHistoryRoute,
  productionHistoryAltRoute,
  dispatchRoute,
  workInHandRoute,
  dailyProductionReportRoute,
  containerDailyReportRoute,
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
