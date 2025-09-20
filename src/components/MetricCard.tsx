import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down';
  };
  format?: 'currency' | 'percentage' | 'number';
  className?: string;
}

export default function MetricCard({ title, value, change, format = 'number', className }: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return `€${val}`;
    }
    if (format === 'percentage') {
      return `${val}%`;
    }
    return val;
  };

  return (
    <div className={cn("bg-card rounded-lg border border-border p-6 shadow-card", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-card-foreground">{formatValue(value)}</p>
        </div>
        {change && (
          <div className={cn(
            "flex items-center text-xs font-medium",
            change.trend === 'up' ? "text-success" : "text-destructive"
          )}>
            {change.trend === 'up' ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {change.value}
          </div>
        )}
      </div>
    </div>
  );
}