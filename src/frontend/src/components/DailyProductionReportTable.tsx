import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DailyProductionReport } from '../backend';
import { ArrowUpDown, ArrowUp, ArrowDown, Edit } from 'lucide-react';

interface DailyProductionReportTableProps {
  reports: DailyProductionReport[];
  onEdit: (report: DailyProductionReport) => void;
  isViewerRole?: boolean;
}

type SortField = 'date' | 'operation' | 'todayProduction' | 'totalCompleted' | 'despatched' | 'inHand';
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
        aValue = a.operation.name;
        bValue = b.operation.name;
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
                    onClick={() => handleSort('despatched')}
                    className="gap-2 font-semibold"
                  >
                    Despatched
                    <SortIcon field="despatched" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('inHand')} className="gap-2 font-semibold">
                    In Hand
                    <SortIcon field="inHand" />
                  </Button>
                </TableHead>
                {!isViewerRole && <TableHead className="text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReports.map((report, index) => (
                <TableRow key={`${report.date}-${report.operation.id}-${index}`}>
                  <TableCell className="font-medium">{report.date}</TableCell>
                  <TableCell>{report.operation.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.todayProduction).toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.totalCompleted).toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.despatched).toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.inHand).toLocaleString()}</TableCell>
                  {!isViewerRole && (
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(report)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
