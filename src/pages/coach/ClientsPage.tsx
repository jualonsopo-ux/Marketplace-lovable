import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Plus, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  Filter,
  MoreVertical
} from 'lucide-react';

const ClientsPage = () => {
  // Mock data
  const clients = [
    {
      id: '1',
      name: 'Ana García',
      email: 'ana@email.com',
      status: 'active',
      sessions: 12,
      nextSession: 'Hoy, 15:00',
      progress: 85,
      avatar: null
    },
    {
      id: '2',
      name: 'Carlos Mendoza',
      email: 'carlos@email.com',
      status: 'active',
      sessions: 8,
      nextSession: 'Mañana, 10:00',
      progress: 72,
      avatar: null
    },
    {
      id: '3',
      name: 'Laura Sánchez',
      email: 'laura@email.com',
      status: 'pending',
      sessions: 3,
      nextSession: 'Pendiente',
      progress: 45,
      avatar: null
    }
  ];

  const stats = [
    { label: 'Total Clientes', value: '24', icon: Users },
    { label: 'Activos', value: '18', icon: TrendingUp },
    { label: 'Sesiones este mes', value: '45', icon: Calendar },
    { label: 'Nuevos este mes', value: '6', icon: Plus }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu cartera de clientes y su progreso
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
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

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <CardDescription>{client.email}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado</span>
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status === 'active' ? 'Activo' : 'Pendiente'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sesiones</span>
                <span className="font-medium">{client.sessions}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progreso</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${client.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{client.progress}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Próxima sesión</span>
                <span className="text-sm font-medium">{client.nextSession}</span>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Sesión
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Mensaje
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;