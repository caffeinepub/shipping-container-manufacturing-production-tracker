import { useState, useMemo } from 'react';
import { useGetAllDailyProductionReports } from '../hooks/useGetAllDailyProductionReports';
import { useGetAllOperations } from '../hooks/useGetAllOperations';
import { Calendar } from 'lucide-react';
import { DailyProductionReport } from '../backend';

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
    const reportsByOperation = new Map<string, DailyProductionReport>();
    reports
      .filter((report) => report.date === selectedDate)
      .forEach((report) => {
        reportsByOperation.set(report.operation.id.toString(), report);
      });

    // Create display rows for all 17 operations in order
    return operations.map((operation) => {
      const report = reportsByOperation.get(operation.id.toString());
      const todayProduction = report ? Number(report.todayProduction) : 0;
      const totalCompleted = report ? Number(report.totalCompleted) : 0;
      const despatched = report ? Number(report.despatched) : 0;
      
      // Calculate In Hand dynamically: Total Completed - Despatch
      const inHand = Math.max(0, totalCompleted - despatched);
      
      return {
        slNo: Number(operation.id),
        operationName: operation.name,
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
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
          CONTAINER DAILY REPORT
        </h1>
        
        {/* Date Picker */}
        <div className="flex items-center justify-center gap-2">
          <label htmlFor="report-date" className="text-sm font-semibold text-foreground">
            Date:
          </label>
          <div className="relative inline-flex items-center">
            <Calendar className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              id="report-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input bg-background rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Excel-style Table */}
      <div className="bg-white dark:bg-card border border-border shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading report data...
          </div>
        ) : displayData.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No operations available
          </div>
        ) : (
          <table className="w-full excel-table">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="excel-cell excel-header text-center" style={{ width: '80px' }}>
                  Sl No
                </th>
                <th className="excel-cell excel-header text-left">
                  Operation
                </th>
                <th className="excel-cell excel-header text-right" style={{ width: '150px' }}>
                  Today Production
                </th>
                <th className="excel-cell excel-header text-right" style={{ width: '150px' }}>
                  Total Completed
                </th>
                <th className="excel-cell excel-header text-right" style={{ width: '150px' }}>
                  Despatch
                </th>
                <th className="excel-cell excel-header text-right" style={{ width: '150px' }}>
                  In Hand
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row) => (
                <tr key={row.slNo} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="excel-cell text-center">
                    {row.slNo}
                  </td>
                  <td className="excel-cell text-left font-medium">
                    {row.operationName}
                  </td>
                  <td className="excel-cell text-right tabular-nums">
                    {row.todayProduction.toLocaleString()}
                  </td>
                  <td className="excel-cell text-right tabular-nums">
                    {row.totalCompleted.toLocaleString()}
                  </td>
                  <td className="excel-cell text-right tabular-nums">
                    {row.despatched.toLocaleString()}
                  </td>
                  <td className="excel-cell text-right tabular-nums">
                    {row.inHand.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
