import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'ocean' | 'blue' | 'gold' | 'red' | 'default';
}

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend,
  variant = 'default'
}: MetricCardProps) {
  
  const variantStyles = {
    ocean: 'neon-border-ocean hover:neon-glow-ocean',
    blue: 'neon-border-blue hover:neon-glow-blue',
    gold: 'neon-border-gold hover:neon-glow-gold',
    red: 'neon-border-red',
    default: 'border-border'
  };

  const iconStyles = {
    ocean: 'text-primary',
    blue: 'text-secondary',
    gold: 'text-accent',
    red: 'text-destructive',
    default: 'text-muted-foreground'
  };

  const valueStyles = {
    ocean: 'text-primary',
    blue: 'text-secondary',
    gold: 'text-accent',
    red: 'text-destructive',
    default: 'text-foreground'
  };

  return (
    <Card className={`bg-card/50 backdrop-blur-sm ${variantStyles[variant]} hover-lift transition-all duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold ${valueStyles[variant]} transition-all duration-300`}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
        {trend && (
          <div className={`text-xs mt-2 font-medium ${trend.isPositive ? 'text-primary' : 'text-destructive'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
