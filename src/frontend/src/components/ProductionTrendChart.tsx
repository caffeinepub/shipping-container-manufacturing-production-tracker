import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyProductionReport } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ProductionTrendChartProps {
  reports: DailyProductionReport[];
}

export default function ProductionTrendChart({ reports }: ProductionTrendChartProps) {
  const chartData = useMemo(() => {
    // Group reports by date and sum today_production
    const dataByDate = new Map<string, number>();

    reports.forEach((report) => {
      if (report.date) {
        const currentTotal = dataByDate.get(report.date) || 0;
        dataByDate.set(report.date, currentTotal + Number(report.todayProduction));
      }
    });

    // Convert to array and sort by date
    const sortedData = Array.from(dataByDate.entries())
      .map(([date, totalProduction]) => ({
        date,
        totalProduction,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return sortedData;
  }, [reports]);

  if (chartData.length === 0) {
    return (
      <Card className="card-industrial">
        <CardHeader>
          <CardTitle>Production Trend</CardTitle>
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
        <CardTitle>Production Trend</CardTitle>
        <p className="text-sm text-muted-foreground">Daily total production output over time</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'oklch(var(--muted-foreground))' }}
              tickLine={{ stroke: 'oklch(var(--border))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'oklch(var(--muted-foreground))' }}
              tickLine={{ stroke: 'oklch(var(--border))' }}
              label={{ value: 'Total Production', angle: -90, position: 'insideLeft', fill: 'oklch(var(--muted-foreground))' }}
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
            <Line
              type="monotone"
              dataKey="totalProduction"
              stroke="oklch(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: 'oklch(var(--chart-1))', r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Production"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
