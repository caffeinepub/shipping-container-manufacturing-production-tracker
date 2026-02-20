import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkInHandRecord } from '../backend';
import { Package } from 'lucide-react';

interface WorkInHandTableProps {
  records: WorkInHandRecord[];
}

export default function WorkInHandTable({ records }: WorkInHandTableProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Work in Hand Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No inventory data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Work in Hand Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Container Type</TableHead>
                <TableHead className="text-right">Produced</TableHead>
                <TableHead className="text-right">Dispatched</TableHead>
                <TableHead className="text-right font-semibold">Current Inventory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.containerType}</TableCell>
                  <TableCell className="text-right">{Number(record.producedQuantity)}</TableCell>
                  <TableCell className="text-right">{Number(record.dispatchedQuantity)}</TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {Number(record.currentInventory)}
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
