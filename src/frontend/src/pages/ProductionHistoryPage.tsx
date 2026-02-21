import { useState } from 'react';
import { useGetAllDailyProductionReports } from '../hooks/useGetAllDailyProductionReports';
import { useGetCallerRole } from '../hooks/useGetCallerRole';
import DailyProductionReportFilter from '../components/DailyProductionReportFilter';
import DailyProductionReportTable from '../components/DailyProductionReportTable';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ProductionHistoryPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operationId, setOperationId] = useState('');

  const { data: allReports = [], isLoading } = useGetAllDailyProductionReports();
  const { data: role } = useGetCallerRole();

  const isViewerRole = role !== 'admin';

  const handleFilter = (start: string, end: string, opId: string) => {
    setStartDate(start);
    setEndDate(end);
    setOperationId(opId);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setOperationId('');
  };

  // Apply filters
  const filteredReports = allReports.filter((report) => {
    let matches = true;

    if (startDate && report.date < startDate) {
      matches = false;
    }

    if (endDate && report.date > endDate) {
      matches = false;
    }

    if (operationId && report.operationId.toString() !== operationId) {
      matches = false;
    }

    return matches;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Production History</h1>
        <p className="text-muted-foreground mt-1">View and filter historical production records</p>
      </div>

      {isViewerRole && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Read-Only Access</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              You have viewer access. Contact an administrator to update production data.
            </p>
          </div>
        </div>
      )}

      <DailyProductionReportFilter onFilter={handleFilter} onClear={handleClearFilter} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading production history...</p>
          </div>
        </div>
      ) : (
        <DailyProductionReportTable reports={filteredReports} onEdit={() => {}} isViewerRole={isViewerRole} />
      )}
    </div>
  );
}
