import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export default function SummaryCard({ title, value, icon: Icon, description, variant = 'default' }: SummaryCardProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const numericValue = parseFloat(value.replace(/,/g, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    setIsAnimating(true);
    const duration = 800;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, numericValue);
      
      if (value.includes('.')) {
        setDisplayValue(current.toFixed(1));
      } else {
        setDisplayValue(Math.floor(current).toLocaleString());
      }

      if (step >= steps) {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const variantStyles = {
    default: 'border-border',
    primary: 'border-primary/30 bg-primary/5',
    success: 'border-success/30 bg-success/5',
    warning: 'border-destructive/30 bg-destructive/5',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-destructive',
  };

  return (
    <Card className={`${variantStyles[variant]} transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconStyles[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold font-mono tabular-nums ${isAnimating ? 'animate-counter' : ''}`}>
          {displayValue}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
}
