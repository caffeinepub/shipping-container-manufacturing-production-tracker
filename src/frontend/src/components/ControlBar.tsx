import { useEffect, useState } from 'react';
import { Clock, Activity } from 'lucide-react';

interface ControlBarProps {
  isOperational: boolean;
}

export default function ControlBar({ isOperational }: ControlBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1 bg-primary"></div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Facility</div>
            <div className="text-lg font-semibold text-foreground">Container Manufacturing Facility</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">{formatDate(currentTime)}</div>
              <div className="text-lg font-mono font-semibold text-foreground tabular-nums">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className={`h-5 w-5 ${isOperational ? 'text-success' : 'text-muted-foreground'}`} />
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className={`text-sm font-semibold ${isOperational ? 'text-success' : 'text-muted-foreground'}`}>
                {isOperational ? 'OPERATIONAL' : 'IDLE'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
