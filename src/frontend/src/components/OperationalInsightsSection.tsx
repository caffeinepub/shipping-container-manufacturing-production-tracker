import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Gauge, Zap, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OperationalInsightsSectionProps {
  averageDailyOutput: number;
  capacityUtilization: number;
  productionEfficiency: number;
  estimatedMonthlyOutput: number;
}

export default function OperationalInsightsSection({
  averageDailyOutput,
  capacityUtilization,
  productionEfficiency,
  estimatedMonthlyOutput,
}: OperationalInsightsSectionProps) {
  const [displayCapacity, setDisplayCapacity] = useState(0);
  const [displayEfficiency, setDisplayEfficiency] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayCapacity(capacityUtilization);
      setDisplayEfficiency(productionEfficiency);
    }, 100);

    return () => clearTimeout(timer);
  }, [capacityUtilization, productionEfficiency]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Operational Insights</h2>
        <p className="text-muted-foreground">Executive-level performance metrics and projections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Average Daily Output */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Average Daily Output
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono tabular-nums text-primary">
              {averageDailyOutput.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Containers per day</p>
          </CardContent>
        </Card>

        {/* Capacity Utilization */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Capacity Utilization
              </CardTitle>
              <Gauge className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold font-mono tabular-nums">
              {displayCapacity}%
            </div>
            <Progress 
              value={displayCapacity} 
              className={`h-2 ${displayCapacity >= 70 ? 'bg-success/20' : 'bg-destructive/20'}`}
            />
            <p className="text-xs text-muted-foreground">
              {displayCapacity >= 70 ? 'Optimal utilization' : 'Below target'}
            </p>
          </CardContent>
        </Card>

        {/* Production Efficiency */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Production Efficiency
              </CardTitle>
              <Zap className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold font-mono tabular-nums">
              {displayEfficiency}%
            </div>
            <Progress 
              value={displayEfficiency} 
              className={`h-2 ${displayEfficiency >= 80 ? 'bg-success/20' : 'bg-destructive/20'}`}
            />
            <p className="text-xs text-muted-foreground">
              {displayEfficiency >= 80 ? 'High efficiency' : 'Needs improvement'}
            </p>
          </CardContent>
        </Card>

        {/* Estimated Monthly Output */}
        <Card className="border-success/30 bg-success/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Monthly Projection
              </CardTitle>
              <Target className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono tabular-nums text-success">
              {Math.round(estimatedMonthlyOutput)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Estimated containers this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
