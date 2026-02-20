import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, X, Filter } from 'lucide-react';
import { DailyProductionReport } from '../backend';

const DEFAULT_OPERATIONS = [
  'Boxing',
  'Welding/Finishing',
  'Rear Wall',
  'Front Wall',
  'Side Wall',
  'Roof',
  'Rear Door',
  'Blasting & Primer',
  'Final Paint',
  'Gasket',
  'DLM',
  'Plywood',
  'Floor Screw',
  'Decal',
  'Data Plate',
  'Sikha',
  'Black Paint',
];

interface DailyProductionReportFilterProps {
  reports: DailyProductionReport[];
  onFilterChange: (filtered: DailyProductionReport[]) => void;
}

export default function DailyProductionReportFilter({ reports, onFilterChange }: DailyProductionReportFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operationName, setOperationName] = useState('');

  const handleApply = () => {
    let filtered = [...reports];

    if (startDate && endDate) {
      filtered = filtered.filter((report) => report.date >= startDate && report.date <= endDate);
    }

    if (operationName) {
      filtered = filtered.filter((report) => report.operationName === operationName);
    }

    onFilterChange(filtered);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setOperationName('');
    onFilterChange([]);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filter Reports
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operationFilter">Operation</Label>
              <Select value={operationName} onValueChange={setOperationName}>
                <SelectTrigger id="operationFilter">
                  <SelectValue placeholder="All operations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All operations</SelectItem>
                  {DEFAULT_OPERATIONS.map((operation) => (
                    <SelectItem key={operation} value={operation}>
                      {operation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApply} className="flex-1">
                Apply Filter
              </Button>
              <Button onClick={handleClear} variant="outline" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
