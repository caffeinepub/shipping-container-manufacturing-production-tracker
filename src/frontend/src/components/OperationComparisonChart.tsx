import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { EnrichedDailyProductionReport } from '../hooks/useGetAllDailyProductionReports';
import { useGetAllOperations } from '../hooks/useGetAllOperations';
import { BarChart3 } from 'lucide-react';

interface OperationComparisonChartProps {
  reports: EnrichedDailyProductionReport[];
}

export default function OperationComparisonChart({ reports }: OperationComparisonChartProps) {
  const { data: operations = [] } = useGetAllOperations();

  const chartData = useMemo(() => {
    // Create a map of operation data by operation_id
    const dataByOperationId = new Map<number, { operationName: string; totalCompleted: number }>();

    reports.forEach((report) => {
      const operationId = Number(report.operationId);
      const currentData = dataByOperationId.get(operationId);
      const totalCompleted = Number(report.totalCompleted);
      
      if (!currentData || totalCompleted > currentData.totalCompleted) {
        dataByOperationId.set(operationId, {
          operationName: report.operation.operationName,
          totalCompleted,
        });
      }
    });

    // Build chart data in sequential order (1-17) using operations list
    const data = operations.map((operation) => {
      const operationId = Number(operation.operationId);
      const operationData = dataByOperationId.get(operationId);
      
      return {
        operation: operation.operationName,
        totalCompleted: operationData ? operationData.totalCompleted : 0,
      };
    });

    return data;
  }, [reports, operations]);

  if (chartData.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Operation-wise Output
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No production data available</p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...chartData.map(d => d.totalCompleted));

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Operation-wise Output
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="operation"
              stroke="oklch(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              stroke="oklch(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '6px',
                color: 'oklch(var(--foreground))',
              }}
              labelStyle={{ color: 'oklch(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ color: 'oklch(var(--foreground))' }} />
            <Bar
              dataKey="totalCompleted"
              name="Total Completed"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              animationBegin={0}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.totalCompleted === maxValue && maxValue > 0 ? '#B91C1C' : '#2563EB'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
