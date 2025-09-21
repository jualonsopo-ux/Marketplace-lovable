import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCoachAnalytics } from '@/hooks/dashboard/use-coach-analytics';
import { Euro } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChartDataPoint {
  date: string;
  revenue: number;
  sessions: number;
}

export function RevenueChart() {
  const { data: analytics, isLoading, error } = useCoachAnalytics('month');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Ingresos del Mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Ingresos del Mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Error al cargar los datos
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data for the chart
  const chartData: ChartDataPoint[] = analytics?.bookings
    .filter(b => b.status === 'completed')
    .reduce((acc, booking) => {
      const date = format(parseISO(booking.scheduled_at), 'MMM dd', { locale: es });
      const existing = acc.find(d => d.date === date);
      
      if (existing) {
        existing.revenue += 50; // Placeholder revenue per booking
        existing.sessions += 1;
      } else {
        acc.push({ 
          date, 
          revenue: 50, // Placeholder revenue per booking
          sessions: 1
        });
      }
      return acc;
    }, [] as ChartDataPoint[])
    .sort((a, b) => a.date.localeCompare(b.date)) || [];

  const totalRevenue = analytics?.totalRevenue || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="h-5 w-5" />
          Ingresos del Mes
        </CardTitle>
        <CardDescription>
          Evolución diaria de tus ingresos - Total: €{totalRevenue.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay datos de ingresos para mostrar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'revenue') return [`€${value.toFixed(2)}`, 'Ingresos'];
                  return [value, 'Sesiones'];
                }}
                labelFormatter={(label) => `Fecha: ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ 
                  fill: 'hsl(var(--primary))',
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{ 
                  r: 6, 
                  fill: 'hsl(var(--primary))',
                  strokeWidth: 2,
                  stroke: 'hsl(var(--background))'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}