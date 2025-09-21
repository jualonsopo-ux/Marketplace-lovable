import { Calendar, Heart, TrendingUp, User, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for client dashboard
const clientStats = {
  nextSession: { coach: "Ana García", date: "2024-01-15", time: "10:00", type: "Coaching Personal" },
  totalSessions: 12,
  favoriteCoaches: 3,
  wellnessScore: 78,
};

const upcomingSessions = [
  { id: 1, coach: "Ana García", date: "2024-01-15", time: "10:00", type: "Coaching Personal", status: "confirmed" },
  { id: 2, coach: "Laura Martín", date: "2024-01-17", time: "15:30", type: "Coaching de Carrera", status: "pending" },
  { id: 3, coach: "Pablo Ruiz", date: "2024-01-20", time: "09:00", type: "Psicología", status: "confirmed" },
];

const recentCoaches = [
  { name: "Ana García", specialty: "Coaching Personal", rating: 4.9, sessions: 8, image: "/src/assets/coach-ana.jpg" },
  { name: "Laura Martín", specialty: "Coaching de Carrera", rating: 4.8, sessions: 3, image: "/src/assets/coach-laura.jpg" },
  { name: "Pablo Ruiz", specialty: "Psicología", rating: 5.0, sessions: 1, image: "/src/assets/psychologist-pablo.jpg" },
];

const wellnessData = [
  { area: "Bienestar Emocional", score: 82, color: "bg-success" },
  { area: "Desarrollo Profesional", score: 75, color: "bg-primary" },
  { area: "Relaciones Personales", score: 68, color: "bg-warning" },
  { area: "Salud Mental", score: 85, color: "bg-success" },
];

export function ClientDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">¡Bienvenido de vuelta!</h1>
          <p className="text-muted-foreground">
            Continúa tu camino hacia el bienestar y el crecimiento personal
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Sesión</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientStats.nextSession.time}</div>
              <p className="text-xs text-muted-foreground">
                {clientStats.nextSession.coach} - {clientStats.nextSession.date}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientStats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                +2 este mes
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coaches Favoritos</CardTitle>
              <Star className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientStats.favoriteCoaches}</div>
              <p className="text-xs text-muted-foreground">
                Especializados en tus objetivos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Puntuación Bienestar</CardTitle>
              <Heart className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientStats.wellnessScore}%</div>
              <p className="text-xs text-muted-foreground">
                +8% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Sesiones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Sesiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col">
                        <p className="font-medium text-foreground">{session.coach}</p>
                        <p className="text-sm text-muted-foreground">{session.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{session.date}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {session.time}
                        </p>
                      </div>
                      <Badge variant={session.status === "confirmed" ? "default" : "secondary"}>
                        {session.status === "confirmed" ? "Confirmada" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-4" variant="outline">
                  Ver todas las sesiones
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mis Coaches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mis Coaches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCoaches.map((coach, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {coach.name[0]}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-foreground">{coach.name}</p>
                        <p className="text-sm text-muted-foreground">{coach.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-current text-warning mr-1" />
                        <span className="text-sm font-medium">{coach.rating}</span>
                      </div>
                      <Badge variant="outline">{coach.sessions} sesiones</Badge>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-4" variant="outline">
                  Explorar más coaches
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wellness Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tu Progreso de Bienestar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wellnessData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-foreground">{item.area}</p>
                    <p className="text-sm text-muted-foreground">{item.score}%</p>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
              <h4 className="font-medium text-success mb-2">¡Excelente progreso!</h4>
              <p className="text-sm text-muted-foreground">
                Has mejorado un 12% en tu bienestar general este mes. Continúa con tus sesiones regulares para mantener este momentum.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}