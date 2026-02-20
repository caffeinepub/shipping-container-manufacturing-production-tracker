import { useGetWorkInHandStatus } from '../hooks/useGetWorkInHandStatus';
import WorkInHandTable from '../components/WorkInHandTable';
import SummaryCard from '../components/SummaryCard';
import { Package, TrendingUp, Factory, Truck } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function WorkInHandPage() {
  const { data: records = [], isLoading } = useGetWorkInHandStatus();

  const totalInventory = records.reduce((sum, record) => sum + Number(record.currentInventory), 0);
  const totalProduced = records.reduce((sum, record) => sum + Number(record.producedQuantity), 0);
  const totalDispatched = records.reduce((sum, record) => sum + Number(record.dispatchedQuantity), 0);
  const activeTypes = records.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading work in hand status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Work in Hand Status</h1>
        <p className="text-muted-foreground mt-1">Current inventory by container type</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Inventory"
          value={totalInventory}
          icon={TrendingUp}
          description="Current work in hand"
        />
        <SummaryCard
          title="Container Types"
          value={activeTypes}
          icon={Package}
          description="Active operations"
        />
        <SummaryCard
          title="Total Produced"
          value={totalProduced}
          icon={Factory}
          description="All time production"
        />
        <SummaryCard
          title="Total Dispatched"
          value={totalDispatched}
          icon={Truck}
          description="All time dispatches"
        />
      </div>

      {/* Work in Hand Table */}
      <WorkInHandTable records={records} />
    </div>
  );
}
