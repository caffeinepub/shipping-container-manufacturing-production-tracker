import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnrichedDailyProductionReport } from '../hooks/useGetAllDailyProductionReports';
import { FileSpreadsheet } from 'lucide-react';
import { useMemo } from 'react';

interface ProductionDashboardTableProps {
  reports: EnrichedDailyProductionReport[];
}

export default function ProductionDashboardTable({ reports }: ProductionDashboardTableProps) {
  const recentlyUpdated = useMemo(() => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    return new Set(
      reports
        .filter(report => {
          const reportTime = new Date(report.date).getTime();
          return reportTime > fiveMinutesAgo;
        })
        .map(report => report.id.toString())
    );
  }, [reports]);

  // Sort reports by operation_id (1-17 sequential order)
  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => Number(a.operationId) - Number(b.operationId));
  }, [reports]);

  if (reports.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Production Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No production data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Production Report - All Operations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="table-sticky-header">
              <TableRow className="border-border bg-accent/50">
                <TableHead className="font-semibold text-foreground">Operation</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Today Production</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Total Completed</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Despatch</TableHead>
                <TableHead className="text-right font-semibold text-foreground">In Hand</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReports.map((report) => {
                const inHand = Math.max(0, Number(report.totalCompleted) - Number(report.despatch));
                const isRecent = recentlyUpdated.has(report.id.toString());
                
                return (
                  <TableRow 
                    key={`${report.operationId}-${report.id}`}
                    className={`table-compact-row table-hover-highlight border-border ${isRecent ? 'table-row-glow-effect' : ''}`}
                  >
                    <TableCell className="font-medium text-foreground py-3">{report.operation.operationName}</TableCell>
                    <TableCell className="text-right tabular-nums font-mono py-3">{Number(report.todayProduction).toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums font-mono py-3">{Number(report.totalCompleted).toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums font-mono py-3">{Number(report.despatch).toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums font-mono py-3 text-primary font-semibold">{inHand.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
