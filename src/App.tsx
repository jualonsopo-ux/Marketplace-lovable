import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { getCoachById } from '@/data/coaches';
import BookingFlow from '@/components/BookingFlow';

// Layouts
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

// Public Pages
import { HomePage } from '@/pages/HomePage';
import { DiscoverPage } from '@/pages/DiscoverPage';
import CoachLandingPage from '@/components/CoachLandingPage';

// Auth Pages
import AuthPage from './pages/AuthPage';

// Coach Pages
import { AnalyticsDashboard } from '@/pages/coach/AnalyticsDashboard';

// Error Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter basename="/">
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="discover" element={<DiscoverPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Coach Dashboard Routes */}
            <Route 
              path="/coach" 
              element={
                <ProtectedRoute allowedRoles={['coach']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/coach/dashboard" replace />} />
              <Route path="dashboard" element={<AnalyticsDashboard />} />
              <Route path="calendar" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Calendario</h1>
                  <p className="text-muted-foreground">Página en construcción</p>
                </div>
              } />
              <Route path="clients" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Mis Clientes</h1>
                  <p className="text-muted-foreground">Página en construcción</p>
                </div>
              } />
              <Route path="finances" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Finanzas</h1>
                  <p className="text-muted-foreground">Página en construcción</p>
                </div>
              } />
              <Route path="profile" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
                  <p className="text-muted-foreground">Página en construcción</p>
                </div>
              } />
              <Route path="settings" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Configuración</h1>
                  <p className="text-muted-foreground">Página en construcción</p>
                </div>
              } />
            </Route>

            {/* Legacy coach pages (outside main layout for full-screen experience) */}
            <Route path="/coaches/:coachId" element={<CoachLandingPageRoute />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Route components for coach pages
function CoachLandingPageRoute() {
  const coachId = window.location.pathname.split('/coaches/')[1];
  const coach = getCoachById(coachId);
  
  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Coach no encontrado</h1>
          <p className="text-muted-foreground">El coach que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }
  
  return (
    <CoachLandingPage
      coach={coach}
      onBookingClick={() => {
        window.location.href = `/coaches/${coachId}/book`;
      }}
    />
  );
}

function BookingFlowRoute() {
  const coachId = window.location.pathname.split('/coaches/')[1].split('/book')[0];
  const coach = getCoachById(coachId);
  
  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Coach no encontrado</h1>
          <p className="text-muted-foreground">No se puede proceder con la reserva.</p>
        </div>
      </div>
    );
  }
  
  return (
    <BookingFlow
      coach={coach}
      onBack={() => {
        window.location.href = `/coaches/${coachId}`;
      }}
      onComplete={() => {
        // Redirect to login after booking completion to access main app
        window.location.href = '/auth';
      }}
    />
  );
}

export default App;
