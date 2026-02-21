import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const { data: operations = [], isLoading: operationsLoading } = useGetAllOperations();

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
          Filter Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min={startDate}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operationId">Operation</Label>
            <Select value={operationId} onValueChange={setOperationId} disabled={operationsLoading}>
              <SelectTrigger id="operationId">
                <SelectValue placeholder="All operations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All operations</SelectItem>
                {operations.map((operation) => (
                  <SelectItem key={operation.id.toString()} value={operation.id.toString()}>
                    {operation.id}. {operation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handleApply} className="flex-1">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          <Button onClick={handleClear} variant="outline">
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
