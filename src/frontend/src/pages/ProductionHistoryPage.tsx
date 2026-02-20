import { useState } from 'react';
import { useGetProductionRecordsByDateRange } from '../hooks/useGetProductionRecordsByDateRange';
import DateRangeFilter from '../components/DateRangeFilter';
import ProductionHistoryTable from '../components/ProductionHistoryTable';
import { Loader2 } from 'lucide-react';

export default function ProductionHistoryPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: records = [], isLoading } = useGetProductionRecordsByDateRange(startDate, endDate);

  const handleFilterChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Production History</h1>
        <p className="text-muted-foreground mt-1">View and filter historical production records</p>
      </div>

      <DateRangeFilter onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading production history...</p>
          </div>
        </div>
      ) : (
        <ProductionHistoryTable records={records} />
      )}
    </div>
  );
}
