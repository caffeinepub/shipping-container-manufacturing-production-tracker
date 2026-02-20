import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductionRecord } from '../backend';

interface RecentProductionTableProps {
  records: ProductionRecord[];
  limit?: number;
}

export default function RecentProductionTable({ records, limit = 10 }: RecentProductionTableProps) {
  const recentRecords = records.slice(0, limit);

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Production</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No production records yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Production</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Container Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead className="hidden md:table-cell">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell>{record.containerType}</TableCell>
                  <TableCell className="text-right">{Number(record.quantity)}</TableCell>
                  <TableCell>{record.shift}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">{record.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
