import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EnrichedDailyProductionReport } from '../hooks/useGetAllDailyProductionReports';
import { GitCompare } from 'lucide-react';

interface DispatchVsProductionChartProps {
  reports: EnrichedDailyProductionReport[];
}

export default function DispatchVsProductionChart({ reports }: DispatchVsProductionChartProps) {
  const chartData = useMemo(() => {
    const dataByDate = new Map<string, { production: number; dispatch: number }>();

    reports.forEach((report) => {
      const existing = dataByDate.get(report.date) || { production: 0, dispatch: 0 };
      dataByDate.set(report.date, {
        production: existing.production + Number(report.todayProduction),
        dispatch: existing.dispatch + Number(report.despatch),
      });
    });

    const data = Array.from(dataByDate.entries())
      .map(([date, values]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        production: values.production,
        dispatch: values.dispatch,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);

    return data;
  }, [reports]);

  if (chartData.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Dispatch vs Production
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-primary" />
          Dispatch vs Production Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="oklch(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
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
            <Line
              type="monotone"
              dataKey="production"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ fill: '#2563EB', r: 4 }}
              name="Production"
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="dispatch"
              stroke="#16A34A"
              strokeWidth={3}
              dot={{ fill: '#16A34A', r: 4 }}
              name="Dispatch"
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
