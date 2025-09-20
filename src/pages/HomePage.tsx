import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CoachCard } from '@/components/CoachCard';
import { CoachList } from '@/components/CoachList';
import { 
  TrendingUp, 
  Calendar, 
  Star, 
  Users, 
  ArrowRight, 
  Play,
  CheckCircle,
  Zap
} from 'lucide-react';
import { getFeaturedCoaches, coaches } from '@/data/coaches';

export function HomePage() {
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const featuredCoaches = getFeaturedCoaches().slice(0, 3);

  const handleViewProfile = (coachId: string) => {
    setSelectedCoachId(coachId);
    // Navigate to coach profile
    window.location.href = `/coaches/${coachId}`;
  };

  const handleBook = (coachId: string) => {
    // Navigate to booking flow
    window.location.href = `/coaches/${coachId}/book`;
  };

  // Mock user data and stats
  const userStats = {
    completedSessions: 12,
    upcomingSessions: 2,
    favoriteCoaches: 3,
    achievedGoals: 5,
  };

  const quickActions = [
    {
      icon: Calendar,
      title: 'Próxima sesión',
      description: 'Con Ana García',
      time: 'Hoy, 15:00',
      action: 'Ver detalles',
      href: '/sessions/upcoming',
      variant: 'default' as const,
    },
    {
      icon: Star,
      title: 'Coaches recomendados',
      description: '3 nuevos matches',
      action: 'Explorar',
      href: '/discover',
      variant: 'outline' as const,
    },
    {
      icon: TrendingUp,
      title: 'Tu progreso',
      description: '85% objetivos completados',
      action: 'Ver reporte',
      href: '/progress',
      variant: 'outline' as const,
    },
  ];

  const categories = [
    { name: 'Carrera', icon: '💼', count: 45, color: 'bg-blue-100 text-blue-800' },
    { name: 'Bienestar', icon: '🧘', count: 32, color: 'bg-green-100 text-green-800' },
    { name: 'Liderazgo', icon: '👥', count: 28, color: 'bg-purple-100 text-purple-800' },
    { name: 'Hábitos', icon: '⚡', count: 38, color: 'bg-orange-100 text-orange-800' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">¡Hola, María! 👋</h1>
            <p className="text-muted-foreground">
              Listo para seguir creciendo hoy. Tienes {userStats.upcomingSessions} sesiones pendientes.
            </p>
          </div>
          <Button className="gap-2" asChild>
            <Link to="/sessions/new">
              <Play className="h-4 w-4" />
              Nueva sesión
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="notion-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{userStats.completedSessions}</div>
            <div className="text-sm text-muted-foreground">Sesiones completadas</div>
          </CardContent>
        </Card>
        <Card className="notion-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.achievedGoals}</div>
            <div className="text-sm text-muted-foreground">Objetivos logrados</div>
          </CardContent>
        </Card>
        <Card className="notion-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{userStats.upcomingSessions}</div>
            <div className="text-sm text-muted-foreground">Próximas sesiones</div>
          </CardContent>
        </Card>
        <Card className="notion-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{userStats.favoriteCoaches}</div>
            <div className="text-sm text-muted-foreground">Coaches favoritos</div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="notion-card hover:notion-card-hover transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                        {action.time && (
                          <p className="text-xs text-primary font-medium mt-1">{action.time}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant={action.variant} size="sm" asChild>
                    <Link to={action.href}>
                      {action.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Explorar por categoría</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/discover">
              Ver todas
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="notion-card hover:notion-card-hover cursor-pointer transition-all duration-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-medium mb-1">{category.name}</h3>
                <Badge variant="secondary" className={category.color}>
                  {category.count} coaches
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Coaches */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Coaches destacados</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/discover">
              Ver todos
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCoaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              onViewProfile={handleViewProfile}
              onBook={handleBook}
              variant="featured"
            />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Actividad reciente</h2>
        <Card className="notion-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Sesión completada con Ana García</p>
                  <p className="text-sm text-muted-foreground">Coaching de carrera • Hace 2 días</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Sesión agendada con Laura Sánchez</p>
                  <p className="text-sm text-muted-foreground">Hábitos y productividad • Hace 3 días</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Objetivo completado: Rutina matutina</p>
                  <p className="text-sm text-muted-foreground">21 días consecutivos • Hace 5 días</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}