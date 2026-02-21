import { useMemo } from 'react';
import { useGetAllDailyProductionReports } from '../hooks/useGetAllDailyProductionReports';
import { useMonthlyProductionMetrics } from '../hooks/useMonthlyProductionMetrics';
import SummaryCard from '../components/SummaryCard';
import ProductionDashboardTable from '../components/ProductionDashboardTable';
import ProductionTrendChart from '../components/ProductionTrendChart';
import OperationComparisonChart from '../components/OperationComparisonChart';
import DispatchVsProductionChart from '../components/DispatchVsProductionChart';
import OperationalInsightsSection from '../components/OperationalInsightsSection';
import HeroSection from '../components/HeroSection';
import ControlBar from '../components/ControlBar';
import MonthlyTargetCard from '../components/MonthlyTargetCard';
import PresentationModeToggle from '../components/PresentationModeToggle';
import ExportPDFButton from '../components/ExportPDFButton';
import { PresentationModeProvider, usePresentationMode } from '../contexts/PresentationModeContext';
import { Loader2, Package, TrendingUp, Truck, Box } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function ProductionDashboardContent() {
  const { data: allReports = [], isLoading } = useGetAllDailyProductionReports();
  const { data: monthlyMetrics, isLoading: metricsLoading } = useMonthlyProductionMetrics();
  const { isPresentationMode } = usePresentationMode();

  const today = new Date().toISOString().split('T')[0];

  const todayReports = useMemo(() => {
    return allReports.filter((report) => report.date === today);
  }, [allReports, today]);

  const todaySummary = useMemo(() => {
    const totalProduction = todayReports.reduce((sum, report) => sum + Number(report.todayProduction), 0);
    const totalDespatched = todayReports.reduce((sum, report) => sum + Number(report.despatch), 0);
    const totalCompleted = todayReports.reduce((sum, report) => sum + Number(report.totalCompleted), 0);
    const totalInHand = todayReports.reduce((sum, report) => {
      const inHand = Math.max(0, Number(report.totalCompleted) - Number(report.despatch));
      return sum + inHand;
    }, 0);

    return {
      totalProduction,
      totalDespatched,
      totalCompleted,
      totalInHand,
    };
  }, [todayReports]);

  const isOperational = todayReports.length > 0 && todaySummary.totalProduction > 0;

  if (isLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading production dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <HeroSection monthlyTotal={monthlyMetrics?.totalProduced || 0} />

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <ControlBar isOperational={isOperational} />
        
        {!isPresentationMode && (
          <div className="flex gap-2">
            <ExportPDFButton />
            <PresentationModeToggle />
          </div>
        )}
      </div>

      {/* Tabs for Dashboard and Insights */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Production Dashboard
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Operational Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SummaryCard
              title="Today Production"
              value={todaySummary.totalProduction.toString()}
              icon={Package}
              description="Containers produced today"
              variant="primary"
            />
            <SummaryCard
              title="Total Completed"
              value={todaySummary.totalCompleted.toString()}
              icon={TrendingUp}
              description="Cumulative production"
            />
            <SummaryCard
              title="Total Despatch"
              value={todaySummary.totalDespatched.toString()}
              icon={Truck}
              description="Containers dispatched"
            />
            <SummaryCard
              title="Work In Hand"
              value={todaySummary.totalInHand.toString()}
              icon={Box}
              description="Current inventory"
              variant="success"
            />
            <MonthlyTargetCard
              current={monthlyMetrics?.totalProduced || 0}
              target={100}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductionTrendChart reports={allReports} />
            <OperationComparisonChart reports={allReports} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <DispatchVsProductionChart reports={allReports} />
          </div>

          {/* Production Table */}
          <ProductionDashboardTable reports={todayReports} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {monthlyMetrics && (
            <OperationalInsightsSection
              averageDailyOutput={monthlyMetrics.dailyAverage}
              capacityUtilization={monthlyMetrics.capacityUtilization}
              productionEfficiency={monthlyMetrics.productionEfficiency}
              estimatedMonthlyOutput={monthlyMetrics.estimatedMonthlyOutput}
            />
          )}

          {/* Charts for Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductionTrendChart reports={allReports} />
            <DispatchVsProductionChart reports={allReports} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProductionDashboardPage() {
  return (
    <PresentationModeProvider>
      <ProductionDashboardContent />
    </PresentationModeProvider>
  );
}
