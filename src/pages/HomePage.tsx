import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowRight,
  Users,
  Calendar,
  BarChart3,
  CheckCircle,
  Star,
  Target,
  LogIn,
  UserPlus,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Features data
const features = [
  {
    icon: Users,
    title: 'Gestión de Clientes',
    description: 'Administra tu cartera de clientes de forma eficiente y personalizada'
  },
  {
    icon: Calendar,
    title: 'Calendario Inteligente',
    description: 'Programa y gestiona sesiones con recordatorios automáticos'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avanzados',
    description: 'Analiza el progreso de tus clientes con métricas detalladas'
  },
  {
    icon: Target,
    title: 'Objetivos Personalizados',
    description: 'Define y rastrea objetivos específicos para cada cliente'
  }
];

// Testimonials data
const testimonials = [
  {
    name: 'María González',
    role: 'Life Coach',
    content: 'CoachWave ha transformado mi práctica. Ahora puedo enfocarme en lo que realmente importa: ayudar a mis clientes.',
    rating: 5
  },
  {
    name: 'Carlos Mendoza',
    role: 'Executive Coach',
    content: 'La plataforma más completa para coaches. Las analíticas me ayudan a demostrar el valor a mis clientes corporativos.',
    rating: 5
  },
  {
    name: 'Sofía Torres',
    role: 'Wellness Coach',
    content: 'Interfaz intuitiva y herramientas poderosas. Mis clientes están más comprometidos que nunca.',
    rating: 5
  }
];

export function HomePage() {
  const navigate = useNavigate();
  const { user, loading, profile, isAuthenticated } = useAuth();

  // Handle redirection based on authentication status
  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // If user is authenticated and has a profile, redirect to appropriate dashboard
    if (isAuthenticated && user && profile) {
      console.log('Redirecting authenticated user with role:', profile.role);
      switch (profile.role) {
        case 'coach':
        case 'psychologist':
          navigate('/coach/dashboard');
          break;
        case 'staff':
        case 'client':
          navigate('/client/dashboard');
          break;
        case 'admin':
          // Admin without preference - go to role switch  
          navigate('/role-switch');
          break;
        default:
          console.log('Unknown role, redirecting to auth');
          navigate('/auth');
      }
    }
    // If user is authenticated but no profile, redirect to complete setup
    else if (isAuthenticated && user && !profile) {
      console.log('User authenticated but no profile, redirecting to auth');
      navigate('/auth');
    }
    // If not authenticated, show landing page (no redirect needed)
    else {
      console.log('User not authenticated, showing landing page');
    }
  }, [loading, isAuthenticated, user, profile, navigate]);

  // Show loading while authentication is being verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando CoachWave</span>
            </CardTitle>
            <CardDescription>
              Verificando tu sesión...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            {/* Debug/Admin Actions - Temporary */}
            <div className="mb-8 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">🔧 Acciones de desarrollo (temporal)</p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    const { error } = await supabase.auth.signOut();
                    if (!error) {
                      window.location.reload();
                    }
                  }}
                >
                  Cerrar Sesión
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Ir a Login
                </Button>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1" />
              Plataforma #1 para Coaches Profesionales
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Potencia tu práctica de
              <span className="text-primary block">Coaching</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La plataforma integral que te ayuda a gestionar clientes, programar sesiones 
              y hacer crecer tu negocio de coaching de manera profesional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8">
                <UserPlus className="h-5 w-5 mr-2" />
                Comenzar Gratis
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')} className="text-lg px-8">
                <LogIn className="h-5 w-5 mr-2" />
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas para triunfar
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramientas profesionales diseñadas específicamente para coaches que quieren 
              ofrecer la mejor experiencia a sus clientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Transforma tu forma de hacer coaching
              </h2>
              <p className="text-lg text-muted-foreground">
                CoachWave te proporciona todas las herramientas que necesitas para 
                profesionalizar tu práctica y ofrecer resultados excepcionales.
              </p>
              
              <div className="space-y-4">
                {[
                  'Gestión centralizada de todos tus clientes',
                  'Programación inteligente de sesiones',
                  'Seguimiento detallado del progreso',
                  'Reportes profesionales automatizados',
                  'Comunicación fluida con tus clientes'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button size="lg" onClick={() => navigate('/auth')} className="mt-8">
                <UserPlus className="h-5 w-5 mr-2" />
                Comenzar mi prueba gratuita
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="text-2xl font-bold text-primary">150+</div>
                  <div className="text-sm text-muted-foreground">Coaches activos</div>
                </Card>
                <Card className="p-6">
                  <div className="text-2xl font-bold text-primary">2.5k+</div>
                  <div className="text-sm text-muted-foreground">Sesiones realizadas</div>
                </Card>
              </div>
              <div className="space-y-4 pt-8">
                <Card className="p-6">
                  <div className="text-2xl font-bold text-primary">94%</div>
                  <div className="text-sm text-muted-foreground">Satisfacción cliente</div>
                </Card>
                <Card className="p-6">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Soporte disponible</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen nuestros coaches
            </h2>
            <p className="text-xl text-muted-foreground">
              Coaches profesionales que ya están transformando su práctica con CoachWave
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para llevar tu coaching al siguiente nivel?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a cientos de coaches que ya están creciendo con CoachWave
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth')} className="text-lg px-8">
              <UserPlus className="h-5 w-5 mr-2" />
              Crear cuenta gratuita
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <LogIn className="h-5 w-5 mr-2" />
              Ya tengo cuenta
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/20 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">CoachWave</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 CoachWave. Impulsando el coaching profesional.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}