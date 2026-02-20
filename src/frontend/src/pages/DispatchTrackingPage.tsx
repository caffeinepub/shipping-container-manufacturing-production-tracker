import { useGetAllDispatchRecords } from '../hooks/useGetAllDispatchRecords';
import DispatchEntryForm from '../components/DispatchEntryForm';
import DispatchRecordsTable from '../components/DispatchRecordsTable';
import { Loader2 } from 'lucide-react';

export default function DispatchTrackingPage() {
  const { data: records = [], isLoading } = useGetAllDispatchRecords();

  // Sort records by dispatch date (most recent first)
  const sortedRecords = [...records].sort((a, b) => b.dispatchDate.localeCompare(a.dispatchDate));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dispatch Tracking</h1>
        <p className="text-muted-foreground mt-1">Record and track container dispatches</p>
      </div>

      <DispatchEntryForm />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading dispatch records...</p>
          </div>
        </div>
      ) : (
        <DispatchRecordsTable records={sortedRecords} />
      )}
    </div>
  );
}
