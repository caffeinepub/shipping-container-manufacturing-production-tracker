import { useGetAllDispatchRecords } from '../hooks/useGetAllDispatchRecords';
import { useGetCallerRole } from '../hooks/useGetCallerRole';
import DispatchEntryForm from '../components/DispatchEntryForm';
import DispatchRecordsTable from '../components/DispatchRecordsTable';
import { Loader2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DispatchTrackingPage() {
  const { data: records = [], isLoading } = useGetAllDispatchRecords();
  const { data: role, isLoading: roleLoading } = useGetCallerRole();

  // Sort records by dispatch date (most recent first)
  const sortedRecords = [...records].sort((a, b) => b.dispatchDate.localeCompare(a.dispatchDate));

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dispatch Tracking</h1>
        <p className="text-muted-foreground mt-1">Record and track container dispatches</p>
      </div>

      {role === 'viewer' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Read-Only Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You have viewer access and cannot add dispatch records. Please contact an administrator if you need to make changes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <DispatchEntryForm />
      )}

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
