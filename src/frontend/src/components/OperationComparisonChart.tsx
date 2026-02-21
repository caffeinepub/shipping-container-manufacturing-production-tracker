import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyProductionReport } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface OperationComparisonChartProps {
  reports: DailyProductionReport[];
}

export default function OperationComparisonChart({ reports }: OperationComparisonChartProps) {
  const chartData = useMemo(() => {
    // Group reports by operation name and sum total_completed
    const dataByOperation = new Map<string, number>();

    reports.forEach((report) => {
      if (report.operation && report.operation.name) {
        const currentTotal = dataByOperation.get(report.operation.name) || 0;
        dataByOperation.set(report.operation.name, currentTotal + Number(report.totalCompleted));
      }
    });

    // Convert to array and sort by total completed (descending)
    const sortedData = Array.from(dataByOperation.entries())
      .map(([operationName, totalCompleted]) => ({
        operationName,
        totalCompleted,
      }))
      .sort((a, b) => b.totalCompleted - a.totalCompleted);

    return sortedData;
  }, [reports]);

  if (chartData.length === 0) {
    return (
      <Card className="card-industrial">
        <CardHeader>
          <CardTitle>Operation-wise Production Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No production data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-industrial">
      <CardHeader>
        <CardTitle>Operation-wise Production Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">Total completed production by operation</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="operationName"
              className="text-xs"
              tick={{ fill: 'oklch(var(--muted-foreground))' }}
              tickLine={{ stroke: 'oklch(var(--border))' }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'oklch(var(--muted-foreground))' }}
              tickLine={{ stroke: 'oklch(var(--border))' }}
              label={{ value: 'Total Completed', angle: -90, position: 'insideLeft', fill: 'oklch(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(var(--popover))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '0.5rem',
                color: 'oklch(var(--popover-foreground))',
              }}
              labelStyle={{ color: 'oklch(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ color: 'oklch(var(--foreground))' }} />
            <Bar
              dataKey="totalCompleted"
              fill="oklch(var(--chart-2))"
              name="Total Completed"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
