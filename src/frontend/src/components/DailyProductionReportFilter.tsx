import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllOperations } from '../hooks/useGetAllOperations';
import { Filter, X } from 'lucide-react';

interface DailyProductionReportFilterProps {
  onFilter: (startDate: string, endDate: string, operationId: string) => void;
  onClear: () => void;
}

export default function DailyProductionReportFilter({ onFilter, onClear }: DailyProductionReportFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operationId, setOperationId] = useState('');

  const { data: operations = [] } = useGetAllOperations();

  const handleApply = () => {
    onFilter(startDate, endDate, operationId);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setOperationId('');
    onClear();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Production Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operation">Operation</Label>
            <Select value={operationId} onValueChange={setOperationId}>
              <SelectTrigger id="operation">
                <SelectValue placeholder="All Operations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Operations</SelectItem>
                {operations.map((operation) => (
                  <SelectItem key={operation.operationId.toString()} value={operation.operationId.toString()}>
                    {operation.operationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handleApply} className="flex-1">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filter
          </Button>
          <Button onClick={handleClear} variant="outline" className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Clear Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
