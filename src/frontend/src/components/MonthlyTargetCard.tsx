import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MonthlyTargetCardProps {
  current: number;
  target: number;
}

export default function MonthlyTargetCard({ current, target }: MonthlyTargetCardProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const percentage = Math.min(100, Math.round((current / target) * 100));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  const isOnTrack = percentage >= 50;
  const progressColor = isOnTrack ? 'bg-success' : 'bg-destructive';

  return (
    <Card className={`border-${isOnTrack ? 'success' : 'destructive'}/30 bg-${isOnTrack ? 'success' : 'destructive'}/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Monthly Target Progress
        </CardTitle>
        <Target className={`h-5 w-5 ${isOnTrack ? 'text-success' : 'text-destructive'}`} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold font-mono tabular-nums">{current}</div>
          <div className="text-lg text-muted-foreground">/ {target}</div>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={displayProgress} 
            className="h-3 animate-progress"
          />
          <div className="flex justify-between text-xs">
            <span className={isOnTrack ? 'text-success' : 'text-destructive'}>
              {displayProgress}% Complete
            </span>
            <span className="text-muted-foreground">
              {target - current} remaining
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
