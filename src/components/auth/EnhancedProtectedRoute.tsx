import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Shield, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Loader2,
  Home,
  LogIn
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Route configuration with protection levels
const routeConfig = {
  public: [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/',
    '/auth',
    '/debug'
  ],
  protected: [
    '/coach/dashboard',
    '/coach/clients',
    '/coach/sessions',
    '/coach/programs',
    '/coach/analytics',
    '/coach/messages',
    '/coach/resources',
    '/coach/billing',
    '/coach/profile',
    '/coach/settings',
    '/coach/security',
    '/coach/help'
  ],
  admin: [
    '/admin/dashboard',
    '/admin/users',
    '/admin/settings'
  ]
};

// Loading component
const AuthLoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">CW</span>
          </div>
        </div>
        <CardTitle className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading CoachWave</span>
        </CardTitle>
        <CardDescription>
          Verificando autenticación...
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

// Error boundary component
const AuthErrorScreen = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
        <CardTitle className="text-destructive">Error de Autenticación</CardTitle>
        <CardDescription>
          Ha ocurrido un problema al verificar tu sesión
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Error desconocido al cargar la aplicación'}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/login'}>
            <LogIn className="h-4 w-4 mr-2" />
            Ir al Login
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Posibles soluciones:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Verifica tu conexión a internet</li>
            <li>Limpia la caché del navegador</li>
            <li>Verifica que Supabase esté configurado</li>
            <li>Revisa la consola del navegador (F12)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Main ProtectedRoute component
const EnhancedProtectedRoute = ({ children, requiredRole = 'coach' }: { children: React.ReactNode; requiredRole?: string }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    user: null as any,
    error: null as any,
    initialized: false
  });
  
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Mock navigate functionality for demo
  const mockNavigate = (path: string) => {
    console.log(`Would navigate to: ${path}`);
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Check if current route requires authentication
  const isPublicRoute = routeConfig.public.includes(currentPath);
  const isProtectedRoute = routeConfig.protected.some(route => 
    currentPath.startsWith(route)
  );
  const isAdminRoute = routeConfig.admin.some(route => 
    currentPath.startsWith(route)
  );

  // Initialize authentication
  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      // Check for existing session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }

      let user = null;
      if (sessionData?.session?.user) {
        user = sessionData.session.user;
      } else {
        // Try to get user directly
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError && userError.message !== 'Invalid JWT') {
          throw new Error(`User error: ${userError.message}`);
        }
        user = userData?.user || null;
      }

      setAuthState({
        loading: false,
        user,
        error: null,
        initialized: true
      });

      // Log debug info
      console.log('🔐 Auth initialized:', {
        user: user ? { id: user.id, email: user.email } : null,
        route: currentPath,
        isPublic: isPublicRoute,
        isProtected: isProtectedRoute
      });

    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      setAuthState({
        loading: false,
        user: null,
        error: error,
        initialized: true
      });
    }
  };

  // Setup auth state listener
  useEffect(() => {
    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          loading: false,
          error: null,
          initialized: true
        }));
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Route change handler
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    if (authState.initialized) {
      console.log('📍 Route changed:', {
        path: currentPath,
        user: authState.user?.email,
        isPublic: isPublicRoute,
        isProtected: isProtectedRoute
      });
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPath, authState.initialized]);

  // Loading state
  if (authState.loading || !authState.initialized) {
    return <AuthLoadingScreen />;
  }

  // Error state
  if (authState.error) {
    return (
      <AuthErrorScreen 
        error={authState.error} 
        onRetry={initializeAuth}
      />
    );
  }

  // Route protection logic
  const { user } = authState;

  // Public routes - accessible to everyone
  if (isPublicRoute) {
    // If user is already logged in and tries to access login, redirect to dashboard
    if (user && currentPath === '/login') {
      mockNavigate('/coach/dashboard');
      return <div>Redirecting to dashboard...</div>;
    }
    return <>{children}</>;
  }

  // Protected routes - require authentication
  if (isProtectedRoute || isAdminRoute) {
    if (!user) {
      console.log('🚫 Access denied: No user session');
      mockNavigate('/login');
      return <div>Redirecting to login...</div>;
    }

    // Check role for admin routes
    if (isAdminRoute && (user as any).role !== 'admin') {
      console.log('🚫 Access denied: Insufficient permissions');
      mockNavigate('/coach/dashboard');
      return <div>Redirecting to dashboard...</div>;
    }

    // Check role for coach routes
    if (isProtectedRoute && requiredRole === 'coach' && (user as any).role && (user as any).role !== 'coach' && (user as any).role !== 'admin') {
      console.log('🚫 Access denied: Invalid role');
      mockNavigate('/login');
      return <div>Redirecting to login...</div>;
    }

    console.log('✅ Access granted:', {
      user: user.email,
      route: currentPath,
      role: (user as any).role || 'coach'
    });
  }

  return <>{children}</>;
};

// Route debugging component
const RouteDebugger = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    const checkRoute = () => {
      const isPublic = routeConfig.public.includes(currentPath);
      const isProtected = routeConfig.protected.some(route => 
        currentPath.startsWith(route)
      );
      const isAdmin = routeConfig.admin.some(route => 
        currentPath.startsWith(route)
      );

      setDebugInfo({
        currentPath,
        isPublic,
        isProtected,
        isAdmin,
        timestamp: new Date().toISOString()
      });
    };

    window.addEventListener('popstate', handlePopState);
    checkRoute();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPath]);

  if (!debugInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Route Debug Info
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div className="flex justify-between">
            <span>Path:</span>
            <code className="bg-muted px-1 rounded">{debugInfo.currentPath}</code>
          </div>
          <div className="flex justify-between">
            <span>Public:</span>
            {debugInfo.isPublic ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="flex justify-between">
            <span>Protected:</span>
            {debugInfo.isProtected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="flex justify-between">
            <span>Admin:</span>
            {debugInfo.isAdmin ? (
              <CheckCircle className="h-4 w-4 text-orange-500" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Make debug tools available globally in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).routeDebug = {
    checkCurrentRoute: () => {
      const path = window.location.pathname;
      const isPublic = routeConfig.public.includes(path);
      const isProtected = routeConfig.protected.some(route => path.startsWith(route));
      const isAdmin = routeConfig.admin.some(route => path.startsWith(route));
      
      console.log('Route Analysis:', {
        path,
        isPublic,
        isProtected,
        isAdmin,
        config: routeConfig
      });
      
      return { path, isPublic, isProtected, isAdmin };
    },
    
    listAllRoutes: () => {
      console.log('All Routes:', routeConfig);
      return routeConfig;
    },
    
    simulateAuth: (userRole = 'coach') => {
      console.log(`Simulating auth with role: ${userRole}`);
      // This would integrate with your actual auth system
    }
  };
  
  console.log('🛣️ Route debugging tools loaded!');
  console.log('Available commands:');
  console.log('- window.routeDebug.checkCurrentRoute() - Analyze current route');
  console.log('- window.routeDebug.listAllRoutes() - List all route configurations');
  console.log('- window.routeDebug.simulateAuth(role) - Simulate authentication');
}

// Export both components
export { EnhancedProtectedRoute, RouteDebugger };
export default EnhancedProtectedRoute;