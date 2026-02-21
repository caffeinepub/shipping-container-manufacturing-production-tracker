import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnrichedDailyProductionReport } from '../hooks/useGetAllDailyProductionReports';
import { ArrowUpDown, ArrowUp, ArrowDown, Edit } from 'lucide-react';

interface DailyProductionReportTableProps {
  reports: EnrichedDailyProductionReport[];
  onEdit: (report: EnrichedDailyProductionReport) => void;
  isViewerRole?: boolean;
}

type SortField = 'date' | 'operation' | 'todayProduction' | 'totalCompleted' | 'despatch';
type SortDirection = 'asc' | 'desc';

export default function DailyProductionReportTable({ reports, onEdit, isViewerRole = false }: DailyProductionReportTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortField === 'operation') {
        // Sort by operation_id (1-17) to maintain predefined order
        aValue = Number(a.operationId);
        bValue = Number(b.operationId);
      } else if (sortField === 'date') {
        aValue = a.date;
        bValue = b.date;
      } else {
        aValue = Number(a[sortField]);
        bValue = Number(b[sortField]);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [reports, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Production Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No production reports found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Production Reports ({reports.length} records)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('date')} className="gap-2 font-semibold">
                    Date
                    <SortIcon field="date" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('operation')}
                    className="gap-2 font-semibold"
                  >
                    Operation
                    <SortIcon field="operation" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('todayProduction')}
                    className="gap-2 font-semibold"
                  >
                    Today's Production
                    <SortIcon field="todayProduction" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('totalCompleted')}
                    className="gap-2 font-semibold"
                  >
                    Total Completed
                    <SortIcon field="totalCompleted" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('despatch')}
                    className="gap-2 font-semibold"
                  >
                    Despatched
                    <SortIcon field="despatch" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <span className="font-semibold">In Hand</span>
                </TableHead>
                {!isViewerRole && <TableHead className="text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReports.map((report, index) => {
                const inHand = Math.max(0, Number(report.totalCompleted) - Number(report.despatch));
                return (
                  <TableRow key={`${report.date}-${report.operationId}-${index}`}>
                    <TableCell className="font-medium">{report.date}</TableCell>
                    <TableCell>{report.operation.operationName}</TableCell>
                    <TableCell className="text-right tabular-nums">{Number(report.todayProduction).toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{Number(report.totalCompleted).toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{Number(report.despatch).toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{inHand.toLocaleString()}</TableCell>
                    {!isViewerRole && (
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(report)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
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
