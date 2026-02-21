import { useState, useMemo } from 'react';
import { useGetAllDailyProductionReports } from '../hooks/useGetAllDailyProductionReports';
import { useGetAllOperations } from '../hooks/useGetAllOperations';
import { Calendar, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ContainerDailyReportPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const { data: reports = [], isLoading: reportsLoading } = useGetAllDailyProductionReports();
  const { data: operations = [], isLoading: operationsLoading } = useGetAllOperations();

  // Merge operations with reports for the selected date
  const displayData = useMemo(() => {
    if (operations.length === 0) return [];

    // Create a map of reports by operation ID for the selected date
    const reportsByOperation = new Map();
    reports
      .filter((report) => report.date === selectedDate)
      .forEach((report) => {
        reportsByOperation.set(report.operationId.toString(), report);
      });

    // Create display rows for all 17 operations in order
    return operations.map((operation) => {
      const report = reportsByOperation.get(operation.operationId.toString());
      const todayProduction = report ? Number(report.todayProduction) : 0;
      const totalCompleted = report ? Number(report.totalCompleted) : 0;
      const despatched = report ? Number(report.despatch) : 0;
      
      // Calculate In Hand dynamically: Total Completed - Despatch
      const inHand = Math.max(0, totalCompleted - despatched);
      
      return {
        slNo: Number(operation.operationId),
        operationName: operation.operationName,
        todayProduction,
        totalCompleted,
        despatched,
        inHand,
      };
    });
  }, [operations, reports, selectedDate]);

  const isLoading = reportsLoading || operationsLoading;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">CONTAINER DAILY REPORT</h1>
        <p className="text-muted-foreground">View daily production status for all operations</p>
      </div>

      {/* Date Selector */}
      <div className="flex items-center justify-center gap-4 mb-8 bg-card border border-border rounded-lg p-4 max-w-md mx-auto">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <Label htmlFor="report-date" className="font-semibold whitespace-nowrap">
          Report Date:
        </Label>
        <Input
          id="report-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Excel-style Table */}
      {!isLoading && (
        <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
          <table className="excel-table w-full">
            <thead>
              <tr className="bg-muted">
                <th className="excel-cell text-center font-semibold">Sl No</th>
                <th className="excel-cell text-left font-semibold">Operation</th>
                <th className="excel-cell text-right font-semibold">Today Production</th>
                <th className="excel-cell text-right font-semibold">Total Completed</th>
                <th className="excel-cell text-right font-semibold">Despatch</th>
                <th className="excel-cell text-right font-semibold">In Hand</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row) => (
                <tr key={row.slNo} className="hover:bg-accent/30">
                  <td className="excel-cell text-center tabular-nums">{row.slNo}</td>
                  <td className="excel-cell text-left font-medium">{row.operationName}</td>
                  <td className="excel-cell text-right tabular-nums">{row.todayProduction}</td>
                  <td className="excel-cell text-right tabular-nums">{row.totalCompleted}</td>
                  <td className="excel-cell text-right tabular-nums">{row.despatched}</td>
                  <td className="excel-cell text-right tabular-nums">{row.inHand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
