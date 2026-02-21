import { useEffect, useState } from 'react';
import { Factory } from 'lucide-react';

interface HeroSectionProps {
  monthlyTotal: number;
}

export default function HeroSection({ monthlyTotal }: HeroSectionProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (monthlyTotal === 0) {
      setDisplayCount(0);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = monthlyTotal / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(increment * step), monthlyTotal);
      setDisplayCount(current);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [monthlyTotal]);

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-card via-card to-accent/20 border border-border p-8 md:p-12 transition-all duration-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-destructive/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Factory className="h-10 w-10 text-primary" />
          <div className="h-10 w-1 bg-primary"></div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
          Container Manufacturing
          <br />
          <span className="text-primary">Production Intelligence System</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          Real-time operational visibility. Data-driven manufacturing control.
        </p>
        
        <div className="inline-block bg-accent/50 border border-border rounded-lg px-6 py-4">
          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
            Total Containers Produced This Month
          </div>
          <div className="text-5xl md:text-6xl font-bold text-primary font-mono tabular-nums">
            {displayCount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
