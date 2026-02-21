import { useMemo } from 'react';
import { Package, Truck, Warehouse, Calendar, Target, Percent, TrendingUp } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import ProductionDashboardTable from '../components/ProductionDashboardTable';
import ProductionTrendChart from '../components/ProductionTrendChart';
import OperationComparisonChart from '../components/OperationComparisonChart';
import { useGetAllDailyProductionReports } from '../hooks/useGetAllDailyProductionReports';
import { useMonthlyProductionMetrics } from '../hooks/useMonthlyProductionMetrics';

export default function ProductionDashboardPage() {
  const { data: reports = [], isLoading, error } = useGetAllDailyProductionReports();
  const { metrics: monthlyMetrics, isLoading: monthlyLoading } = useMonthlyProductionMetrics();

  // Calculate summary totals
  const summaryTotals = useMemo(() => {
    const totalProducedToday = reports.reduce((sum, report) => sum + Number(report.todayProduction), 0);
    const totalDespatched = reports.reduce((sum, report) => sum + Number(report.despatched), 0);
    const totalInHand = reports.reduce((sum, report) => sum + Number(report.inHand), 0);

    return {
      totalProducedToday,
      totalDespatched,
      totalInHand,
    };
  }, [reports]);

  if (isLoading || monthlyLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Production Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time production monitoring and status</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Production Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time production monitoring and status</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">Failed to load dashboard data</p>
          <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Live Production Dashboard</h1>
        <p className="text-muted-foreground mt-2">Real-time production monitoring and status • Auto-refreshes every 30 seconds</p>
      </div>

      {/* Monthly Production Summary */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Monthly Production Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Containers Produced This Month"
            value={monthlyMetrics.totalProducedThisMonth}
            icon={Calendar}
            description="Cumulative production for current month"
          />
          <SummaryCard
            title="Remaining to Achieve Target"
            value={monthlyMetrics.remainingToTarget}
            icon={Target}
            description="Target: 100 containers per month"
          />
          <SummaryCard
            title="Production Completion Percentage"
            value={`${monthlyMetrics.completionPercentage.toFixed(1)}%`}
            icon={Percent}
            description="Progress towards monthly target"
          />
          <SummaryCard
            title="Daily Average Production"
            value={monthlyMetrics.dailyAverage.toFixed(1)}
            icon={TrendingUp}
            description="Average containers per day this month"
          />
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Today's Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Container Produced Today"
            value={summaryTotals.totalProducedToday}
            icon={Package}
            description="Sum of today's production across all operations"
          />
          <SummaryCard
            title="Total Container Despatched"
            value={summaryTotals.totalDespatched}
            icon={Truck}
            description="Total containers dispatched"
          />
          <SummaryCard
            title="Total Work in Hand"
            value={summaryTotals.totalInHand}
            icon={Warehouse}
            description="Current inventory across all operations"
          />
        </div>
      </div>

      {/* Production Charts */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Production Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductionTrendChart reports={reports} />
          <OperationComparisonChart reports={reports} />
        </div>
      </div>

      {/* Production Table */}
      <ProductionDashboardTable reports={reports} />
    </div>
  );
}
