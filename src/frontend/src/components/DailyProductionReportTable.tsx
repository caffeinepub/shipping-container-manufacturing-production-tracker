import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DailyProductionReport } from '../backend';
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';
import { useDeleteDailyProductionReport } from '../hooks/useDeleteDailyProductionReport';
import { toast } from 'sonner';

interface DailyProductionReportTableProps {
  reports: DailyProductionReport[];
  onEdit: (report: DailyProductionReport) => void;
}

type SortField = 'date' | 'operationName' | 'todayProduction' | 'totalCompleted' | 'despatched' | 'inHand';
type SortDirection = 'asc' | 'desc';

export default function DailyProductionReportTable({ reports, onEdit }: DailyProductionReportTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const deleteReport = useDeleteDailyProductionReport();

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
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (
        sortField === 'todayProduction' ||
        sortField === 'totalCompleted' ||
        sortField === 'despatched' ||
        sortField === 'inHand'
      ) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [reports, sortField, sortDirection]);

  const handleDelete = (report: DailyProductionReport) => {
    deleteReport.mutate(
      { report },
      {
        onSuccess: () => {
          toast.success('Production report deleted successfully');
        },
        onError: (error) => {
          toast.error(`Failed to delete production report: ${error.message}`);
        },
      }
    );
  };

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
                    onClick={() => handleSort('operationName')}
                    className="gap-2 font-semibold"
                  >
                    Operation
                    <SortIcon field="operationName" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('todayProduction')}
                    className="gap-2 font-semibold"
                  >
                    Today
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
                    Total
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{report.date}</TableCell>
                  <TableCell>{report.operationName}</TableCell>
                  <TableCell className="text-right">{Number(report.todayProduction)}</TableCell>
                  <TableCell className="text-right">{Number(report.totalCompleted)}</TableCell>
                  <TableCell className="text-right">{Number(report.despatched)}</TableCell>
                  <TableCell className="text-right">{Number(report.inHand)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(report)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Production Report</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this production report for {report.operationName} on{' '}
                              {report.date}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(report)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
