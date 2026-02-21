import { useState, useMemo } from 'react';
import { useGetAllDailyProductionReports } from '../hooks/useGetAllDailyProductionReports';
import DailyProductionReportFilter from '../components/DailyProductionReportFilter';
import DailyProductionReportTable from '../components/DailyProductionReportTable';
import DailyProductionReportForm from '../components/DailyProductionReportForm';
import { Loader2 } from 'lucide-react';
import { DailyProductionReport } from '../backend';

export default function ProductionHistoryPage() {
  const [filteredReports, setFilteredReports] = useState<DailyProductionReport[]>([]);
  const [editingReport, setEditingReport] = useState<DailyProductionReport | null>(null);

  const { data: allReports = [], isLoading } = useGetAllDailyProductionReports();

  // Display filtered reports if filter is applied, otherwise show all reports
  const displayReports = useMemo(() => {
    return filteredReports.length > 0 ? filteredReports : allReports;
  }, [filteredReports, allReports]);

  const handleFilterChange = (filtered: DailyProductionReport[]) => {
    setFilteredReports(filtered);
  };

  const handleEdit = (report: DailyProductionReport) => {
    setEditingReport(report);
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Production History</h1>
        <p className="text-muted-foreground mt-1">View, filter, and edit historical production records</p>
      </div>

      <DailyProductionReportFilter reports={allReports} onFilterChange={handleFilterChange} />

      {editingReport && (
        <DailyProductionReportForm editingReport={editingReport} onCancelEdit={handleCancelEdit} />
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading production history...</p>
          </div>
        </div>
      ) : (
        <DailyProductionReportTable reports={displayReports} onEdit={handleEdit} />
      )}
    </div>
  );
}
