import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCoachAnalytics } from '@/hooks/dashboard/use-coach-analytics';
import { TrendingUp, Calendar, Star, Users, Euro, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  isLoading?: boolean;
}

function KPICard({ title, value, icon: Icon, trend, isLoading }: KPICardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  const { data: analytics, isLoading, error } = useCoachAnalytics('month');

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-sm text-destructive text-center">
                Error al cargar datos
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: "Ingresos del Mes",
      value: `€${(analytics?.totalRevenue || 0).toFixed(2)}`,
      icon: Euro,
      trend: analytics?.totalRevenue > 0 ? "Sesiones completadas" : "Aún no hay ingresos"
    },
    {
      title: "Sesiones Completadas",
      value: analytics?.completedSessions || 0,
      icon: Calendar,
      trend: `${(analytics?.completionRate || 0).toFixed(1)}% tasa de completado`
    },
    {
      title: "Rating Promedio",
      value: (analytics?.averageRating || 0).toFixed(1),
      icon: Star,
      trend: analytics?.averageRating > 0 ? "Basado en reviews" : "Sin reviews aún"
    },
    {
      title: "Total Sesiones",
      value: analytics?.totalSessions || 0,
      icon: Users,
      trend: "Este mes"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          trend={kpi.trend}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}