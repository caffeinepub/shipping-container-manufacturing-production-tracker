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
          <CardTitle>Production Details</CardTitle>
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
        <CardTitle>Production Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operation Name</TableHead>
                <TableHead className="text-right">Today's Production</TableHead>
                <TableHead className="text-right">Total Completed</TableHead>
                <TableHead className="text-right">Despatched</TableHead>
                <TableHead className="text-right">In Hand</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow key={`${report.operation.id}-${index}`}>
                  <TableCell className="font-medium">{report.operation.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.todayProduction).toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.totalCompleted).toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.despatched).toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(report.inHand).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
