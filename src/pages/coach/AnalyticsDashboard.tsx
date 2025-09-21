import { KPICards } from '@/components/dashboard/analytics/KPICards';
import { RevenueChart } from '@/components/dashboard/analytics/RevenueChart';

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Analytics</h1>
        <p className="text-muted-foreground">
          Visualiza el rendimiento de tus sesiones de coaching
        </p>
      </div>
      
      <KPICards />
      
      <div className="grid grid-cols-1 gap-6">
        <RevenueChart />
      </div>
    </div>
  );
}