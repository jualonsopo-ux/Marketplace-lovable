import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Heart, 
  ArrowRight,
  Crown,
  TrendingUp,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const roleOptions = [
  {
    role: 'admin' as const,
    title: 'Panel de Administración',
    description: 'Gestiona toda la plataforma, coaches y clientes',
    icon: Crown,
    color: 'warning',
    path: '/admin/dashboard',
    features: ['Vista completa de coaches y clientes', 'Analytics globales', 'Configuración del sistema']
  },
  {
    role: 'coach' as const,
    title: 'Dashboard de Coach',
    description: 'Gestiona tus clientes y sesiones de coaching',
    icon: TrendingUp,
    color: 'primary',
    path: '/coach/dashboard',
    features: ['Gestión de clientes', 'Calendario de sesiones', 'Analytics de rendimiento']
  },
  {
    role: 'client' as const,
    title: 'Panel de Cliente',
    description: 'Accede a tus sesiones y progreso personal',
    icon: Heart,
    color: 'success',
    path: '/client/dashboard',
    features: ['Mis sesiones programadas', 'Progreso personal', 'Explorar coaches']
  }
];

export function RoleSwitch() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleRoleSelect = (role: 'admin' | 'coach' | 'client', path: string) => {
    // Save user preference
    localStorage.setItem('coachwave_last_role', role);
    
    // Navigate to selected dashboard
    navigate(path);
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Solo los administradores pueden cambiar entre roles.
            </p>
            <Button onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-primary to-warning rounded-2xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Selecciona tu Vista</h1>
          <p className="text-muted-foreground">
            Como administrador, puedes acceder a cualquier panel de la plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleOptions.map((option) => (
            <Card 
              key={option.role}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
              onClick={() => handleRoleSelect(option.role, option.path)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
                    option.color === 'warning' ? 'bg-gradient-to-br from-warning to-warning/80' :
                    option.color === 'primary' ? 'bg-gradient-to-br from-primary to-primary-glow' :
                    'bg-gradient-to-br from-success to-success/80'
                  }`}>
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {option.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        option.color === 'warning' ? 'bg-warning' :
                        option.color === 'primary' ? 'bg-primary' :
                        'bg-success'
                      }`} />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full group-hover:gap-3 transition-all duration-300"
                  variant={option.color === 'warning' ? 'default' : 'outline'}
                >
                  Acceder
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Badge variant="outline" className="px-4 py-2">
            <User className="w-4 h-4 mr-2" />
            Conectado como {profile?.display_name || 'Administrador'}
          </Badge>
        </div>
      </div>
    </div>
  );
}