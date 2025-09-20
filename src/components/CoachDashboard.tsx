import DashboardHeader from './DashboardHeader';
import MetricCard from './MetricCard';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CoachDashboardProps {
  coach: {
    name: string;
    handle: string;
  };
}

export default function CoachDashboard({ coach }: CoachDashboardProps) {
  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Dashboard"
        subtitle="Gestión de sesiones, ingresos y métricas"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reconciliar con Stripe
            </Button>
          </div>
        }
      />
      
      {/* Filter Badges */}
      <div className="p-6 bg-card border-b border-border">
        <div className="flex gap-2 mb-4">
          <Badge variant="outline">Fallidos</Badge>
          <Badge variant="outline">SCA pendiente</Badge>
          <Badge variant="outline">Reembolsos</Badge>
        </div>
      </div>

      <div className="p-6">
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Ingresos brutos"
            value="18.420"
            format="currency"
            change={{ value: "+15.3%", trend: "up" }}
          />
          <MetricCard
            title="Comisión plataforma (take rate)"
            value="2763"
            format="currency"
          />
          <MetricCard
            title="Comisiones de procesamiento"
            value="542"
            format="currency"
          />
          <MetricCard
            title="Neto al coach"
            value="15.115"
            format="currency"
            change={{ value: "+14.8%", trend: "up" }}
          />
          <MetricCard
            title="Tasa de autorización"
            value="94.2"
            format="percentage"
            className="text-warning"
          />
          <MetricCard
            title="Tasa de disputas"
            value="1.3"
            format="percentage"
            className="text-success"
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Health */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-card">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground mr-3"></div>
              <h3 className="text-lg font-semibold">Salud de cobros</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">% con tarjeta guardada</p>
                <p className="text-2xl font-bold text-warning">68.5%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagos con SCA pendiente</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagos fallidos (48h)</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disputas abiertas</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </div>

          {/* Next Payout */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-card">
            <div className="flex items-center mb-4">
              <span className="text-lg mr-3">€</span>
              <h3 className="text-lg font-semibold">Próximo payout</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-semibold">2025-09-22</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Importe</p>
                <p className="text-2xl font-bold">€3420</p>
              </div>
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Payout instantáneo
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="mt-8 bg-card rounded-lg border border-border">
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 text-sm font-medium text-primary border-b-2 border-primary">
                Transacciones
              </button>
              <button className="py-4 text-sm font-medium text-muted-foreground hover:text-foreground">
                Payouts
              </button>
              <button className="py-4 text-sm font-medium text-muted-foreground hover:text-foreground">
                Disputas / Reembolsos
              </button>
              <button className="py-4 text-sm font-medium text-muted-foreground hover:text-foreground">
                Ajustes de cobro
              </button>
            </nav>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground text-center py-8">
              Aquí se mostrarían las transacciones recientes...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}