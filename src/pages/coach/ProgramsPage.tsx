import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Plus,
  Clock,
  Target,
  TrendingUp,
  Filter,
  MoreVertical
} from 'lucide-react';

const ProgramsPage = () => {
  // Mock data
  const programs = [
    {
      id: '1',
      title: 'Programa de Liderazgo Ejecutivo',
      description: 'Desarrollo de habilidades de liderazgo para ejecutivos',
      duration: '12 semanas',
      clients: 8,
      sessions: 24,
      completionRate: 85,
      status: 'active',
      category: 'Liderazgo'
    },
    {
      id: '2',
      title: 'Coaching de Carrera Profesional',
      description: 'Orientación para el desarrollo profesional',
      duration: '8 semanas',
      clients: 12,
      sessions: 16,
      completionRate: 92,
      status: 'active',
      category: 'Carrera'
    },
    {
      id: '3',
      title: 'Programa de Bienestar Personal',
      description: 'Enfoque holístico para el bienestar',
      duration: '10 semanas',
      clients: 6,
      sessions: 20,
      completionRate: 78,
      status: 'draft',
      category: 'Bienestar'
    }
  ];

  const stats = [
    { label: 'Programas Activos', value: '5', icon: BookOpen },
    { label: 'Total Clientes', value: '34', icon: Users },
    { label: 'Sesiones Programadas', value: '128', icon: Calendar },
    { label: 'Tasa Finalización', value: '87%', icon: Target }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Activo</Badge>;
      case 'draft':
        return <Badge variant="secondary">Borrador</Badge>;
      case 'completed':
        return <Badge variant="outline">Completado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Liderazgo':
        return 'bg-purple-100 text-purple-800';
      case 'Carrera':
        return 'bg-blue-100 text-blue-800';
      case 'Bienestar':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Programas de Coaching</h1>
          <p className="text-muted-foreground">
            Crea y gestiona tus programas de entrenamiento
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Programa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Todos</Button>
          <Button variant="ghost" size="sm">Activos</Button>
          <Button variant="ghost" size="sm">Borradores</Button>
          <Button variant="ghost" size="sm">Completados</Button>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Más Filtros
        </Button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(program.category)}>
                      {program.category}
                    </Badge>
                    {getStatusBadge(program.status)}
                  </div>
                  <CardTitle className="text-lg leading-tight">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{program.clients} clientes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{program.sessions} sesiones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>{program.completionRate}% completado</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso general</span>
                  <span className="font-medium">{program.completionRate}%</span>
                </div>
                <Progress value={program.completionRate} className="h-2" />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">
                  Ver Programa
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Herramientas para gestionar tus programas de coaching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>Crear Programa</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Asignar Clientes</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Target className="h-6 w-6" />
              <span>Ver Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramsPage;