import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DispatchRecord } from '../backend';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DispatchRecordsTableProps {
  records: DispatchRecord[];
}

type SortField = 'dispatchDate' | 'containerType' | 'quantity' | 'destination';
type SortDirection = 'asc' | 'desc';

export default function DispatchRecordsTable({ records }: DispatchRecordsTableProps) {
  const [sortField, setSortField] = useState<SortField>('dispatchDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'quantity') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [records, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dispatch Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No dispatch records yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispatch Records ({records.length} total)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('dispatchDate')}
                    className="gap-2 font-semibold"
                  >
                    Dispatch Date
                    <SortIcon field="dispatchDate" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('containerType')}
                    className="gap-2 font-semibold"
                  >
                    Container Type
                    <SortIcon field="containerType" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('quantity')}
                    className="gap-2 font-semibold"
                  >
                    Quantity
                    <SortIcon field="quantity" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('destination')}
                    className="gap-2 font-semibold"
                  >
                    Destination
                    <SortIcon field="destination" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Tracking Ref</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.dispatchDate}</TableCell>
                  <TableCell>{record.containerType}</TableCell>
                  <TableCell className="text-right">{Number(record.quantity)}</TableCell>
                  <TableCell>{record.destination}</TableCell>
                  <TableCell className="hidden md:table-cell">{record.trackingReference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
