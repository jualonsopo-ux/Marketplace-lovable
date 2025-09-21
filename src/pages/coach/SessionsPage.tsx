import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone,
  MapPin,
  Plus,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const SessionsPage = () => {
  // Mock data
  const upcomingSessions = [
    {
      id: '1',
      clientName: 'Ana García',
      clientAvatar: null,
      type: 'video',
      date: 'Hoy',
      time: '15:00 - 16:00',
      status: 'confirmed',
      topic: 'Desarrollo de carrera'
    },
    {
      id: '2',
      clientName: 'Carlos Mendoza',
      clientAvatar: null,
      type: 'phone',
      date: 'Mañana',
      time: '10:00 - 11:00',
      status: 'pending',
      topic: 'Liderazgo ejecutivo'
    }
  ];

  const recentSessions = [
    {
      id: '3',
      clientName: 'Laura Sánchez',
      clientAvatar: null,
      type: 'video',
      date: 'Ayer',
      time: '14:00 - 15:00',
      status: 'completed',
      topic: 'Gestión del tiempo',
      rating: 5
    },
    {
      id: '4',
      clientName: 'Miguel Torres',
      clientAvatar: null,
      type: 'presencial',
      date: '2 días atrás',
      time: '16:00 - 17:00',
      status: 'completed',
      topic: 'Manejo del estrés',
      rating: 5
    }
  ];

  const stats = [
    { label: 'Sesiones hoy', value: '3', icon: Calendar },
    { label: 'Esta semana', value: '12', icon: Clock },
    { label: 'Completadas', value: '145', icon: CheckCircle },
    { label: 'Pendientes', value: '2', icon: AlertCircle }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'presencial': return <MapPin className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default">Confirmada</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'completed':
        return <Badge variant="outline">Completada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sesiones</h1>
          <p className="text-muted-foreground">
            Gestiona tus sesiones de coaching
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sesión
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

      {/* Sessions Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="recent">Recientes</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={session.clientAvatar} />
                        <AvatarFallback>
                          {session.clientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{session.clientName}</CardTitle>
                        <CardDescription>{session.topic}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{session.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{session.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(session.type)}
                    <span className="text-sm capitalize">{session.type}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Iniciar Sesión
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Reagendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={session.clientAvatar} />
                        <AvatarFallback>
                          {session.clientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{session.clientName}</CardTitle>
                        <CardDescription>{session.topic}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{session.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{session.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(session.type)}
                      <span className="text-sm capitalize">{session.type}</span>
                    </div>
                    {session.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-muted-foreground">Valoración:</span>
                        <span className="text-sm font-medium">⭐ {session.rating}/5</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Notas
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Nueva Sesión
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Vista de todas las sesiones - En desarrollo
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionsPage;