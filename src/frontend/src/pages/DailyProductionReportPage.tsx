import { useState } from 'react';
import { useGetAllDailyProductionReports } from '../hooks/useGetAllDailyProductionReports';
import { useGetCallerRole } from '../hooks/useGetCallerRole';
import DailyProductionReportForm from '../components/DailyProductionReportForm';
import DailyProductionReportTable from '../components/DailyProductionReportTable';
import DailyProductionReportFilter from '../components/DailyProductionReportFilter';
import { DailyProductionReport } from '../backend';
import { Loader2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DailyProductionReportPage() {
  const { data: reports, isLoading, error } = useGetAllDailyProductionReports();
  const { data: role, isLoading: roleLoading } = useGetCallerRole();
  const [filteredReports, setFilteredReports] = useState<DailyProductionReport[]>([]);
  const [editingReport, setEditingReport] = useState<DailyProductionReport | null>(null);

  const handleFilterChange = (filtered: DailyProductionReport[]) => {
    setFilteredReports(filtered);
  };

  const handleEdit = (report: DailyProductionReport) => {
    if (role === 'viewer') {
      return; // Viewers cannot edit
    }
    setEditingReport(report);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  if (isLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading daily production reports: {error.message}</p>
      </div>
    );
  }

  const displayReports = filteredReports.length > 0 ? filteredReports : reports || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Daily Production Report</h1>
        <p className="text-muted-foreground mt-1">Track daily manufacturing status of 40ft High Cube Shipping Containers</p>
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
              You have viewer access and cannot add or edit production reports. Please contact an administrator if you need to make changes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <DailyProductionReportForm editingReport={editingReport} onCancelEdit={handleCancelEdit} />
      )}

      <DailyProductionReportFilter reports={reports || []} onFilterChange={handleFilterChange} />

      <DailyProductionReportTable reports={displayReports} onEdit={handleEdit} isViewerRole={role === 'viewer'} />
    </div>
  );
}
