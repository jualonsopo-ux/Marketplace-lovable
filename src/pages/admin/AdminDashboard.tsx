import { Shield, Users, TrendingUp, AlertTriangle, Eye, Database, Activity, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for admin dashboard
const platformStats = {
  totalUsers: 1247,
  activeCoaches: 89,
  totalSessions: 3456,
  revenue: 125340,
};

const recentActivity = [
  { id: 1, type: "new_coach", user: "María González", action: "Se registró como coach", time: "2 min", status: "pending" },
  { id: 2, type: "session", user: "Carlos Ruiz", action: "Completó sesión con Ana García", time: "15 min", status: "completed" },
  { id: 3, type: "payment", user: "Laura Martín", action: "Pago procesado - €150", time: "32 min", status: "success" },
  { id: 4, type: "alert", user: "Sistema", action: "Coach Pablo Ruiz - Baja calificación", time: "1h", status: "warning" },
];

const coachApprovals = [
  { name: "Elena Vázquez", specialty: "Life Coach", experience: "5 años", status: "pending", rating: null },
  { name: "Miguel Torres", specialty: "Career Coach", experience: "8 años", status: "pending", rating: null },
  { name: "Sofia Herrera", specialty: "Wellness Coach", experience: "3 años", status: "pending", rating: null },
];

const systemAlerts = [
  { type: "warning", message: "Alto volumen de cancelaciones en las últimas 24h", priority: "high" },
  { type: "info", message: "Nuevo coach requiere verificación de documentos", priority: "medium" },
  { type: "success", message: "Backup de base de datos completado", priority: "low" },
];

const revenueData = [
  { day: 'Lun', coaches: 1200, clients: 800 },
  { day: 'Mar', coaches: 1800, clients: 1200 },
  { day: 'Mié', coaches: 1500, clients: 900 },
  { day: 'Jue', coaches: 2200, clients: 1400 },
  { day: 'Vie', coaches: 2800, clients: 1800 },
  { day: 'Sáb', coaches: 2400, clients: 1600 },
  { day: 'Dom', coaches: 1900, clients: 1100 },
];

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-warning" />
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Gestiona la plataforma CoachWave y supervisa todas las actividades
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +89 este mes
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coaches Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.activeCoaches}</div>
              <p className="text-xs text-muted-foreground">
                +5 esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
              <Activity className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalSessions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +234 hoy
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{platformStats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +18% vs mes anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ingresos por Tipo de Usuario (7 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Bar dataKey="coaches" fill="hsl(var(--primary))" name="Coaches" />
                  <Bar dataKey="clients" fill="hsl(var(--success))" name="Clientes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-72 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'completed' ? 'bg-success' :
                        activity.status === 'warning' ? 'bg-warning' :
                        activity.status === 'success' ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-foreground">{activity.user}</p>
                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      hace {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coach Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Coaches Pendientes de Aprobación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coachApprovals.map((coach, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-warning-foreground">
                          {coach.name[0]}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-foreground">{coach.name}</p>
                        <p className="text-sm text-muted-foreground">{coach.specialty} • {coach.experience}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-success hover:bg-success/10">
                        Aprobar
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    alert.priority === 'high' ? 'bg-destructive/10 border-destructive/30' :
                    alert.priority === 'medium' ? 'bg-warning/10 border-warning/30' :
                    'bg-success/10 border-success/30'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.priority === 'high' ? 'bg-destructive' :
                          alert.priority === 'medium' ? 'bg-warning' :
                          'bg-success'
                        }`} />
                        <p className="text-sm text-foreground">{alert.message}</p>
                      </div>
                      <Badge variant={
                        alert.priority === 'high' ? 'destructive' :
                        alert.priority === 'medium' ? 'secondary' :
                        'default'
                      }>
                        {alert.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Eye className="h-6 w-6" />
                <span>Vista Coach</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Users className="h-6 w-6" />
                <span>Vista Cliente</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Database className="h-6 w-6" />
                <span>Base de Datos</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <TrendingUp className="h-6 w-6" />
                <span>Reportes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}