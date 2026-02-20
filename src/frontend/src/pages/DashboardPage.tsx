import { useGetAllProductionRecords } from '../hooks/useGetAllProductionRecords';
import { useGetAllDispatchRecords } from '../hooks/useGetAllDispatchRecords';
import SummaryCard from '../components/SummaryCard';
import RecentProductionTable from '../components/RecentProductionTable';
import { Package, Factory, Truck, TrendingUp } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data: productionRecords = [], isLoading: productionLoading } = useGetAllProductionRecords();
  const { data: dispatchRecords = [], isLoading: dispatchLoading } = useGetAllDispatchRecords();

  const isLoading = productionLoading || dispatchLoading;

  // Calculate metrics
  const totalProduced = productionRecords.reduce((sum, record) => sum + Number(record.quantity), 0);
  const totalDispatched = dispatchRecords.reduce((sum, record) => sum + Number(record.quantity), 0);
  const containerTypes = new Set(productionRecords.map((r) => r.containerType)).size;
  const workInHand = totalProduced - totalDispatched;

  // Sort production records by date (most recent first)
  const sortedRecords = [...productionRecords].sort((a, b) => b.date.localeCompare(a.date));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Production Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of container manufacturing operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Produced" value={totalProduced} icon={Factory} description="All time production" />
        <SummaryCard
          title="Container Types"
          value={containerTypes}
          icon={Package}
          description="Active operations"
        />
        <SummaryCard title="Total Dispatched" value={totalDispatched} icon={Truck} description="All time dispatches" />
        <SummaryCard
          title="Work in Hand"
          value={workInHand}
          icon={TrendingUp}
          description="Current inventory"
        />
      </div>

      {/* Recent Production */}
      <RecentProductionTable records={sortedRecords} limit={10} />
    </div>
  );
}
