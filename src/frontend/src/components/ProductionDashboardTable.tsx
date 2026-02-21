import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyProductionReport } from '../backend';

interface ProductionDashboardTableProps {
  reports: DailyProductionReport[];
}

export default function ProductionDashboardTable({ reports }: ProductionDashboardTableProps) {
  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Date-wise Daily Production</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No production data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date-wise Daily Production ({reports.length} operations)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Operation Name</TableHead>
                <TableHead className="text-right font-semibold">Today's Production</TableHead>
                <TableHead className="text-right font-semibold">Total Completed</TableHead>
                <TableHead className="text-right font-semibold">Despatched</TableHead>
                <TableHead className="text-right font-semibold">In Hand</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{report.operationName}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.todayProduction)}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.totalCompleted)}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.despatched)}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{Number(report.inHand)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
