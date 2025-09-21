import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RouteDebugger } from '@/components/auth/EnhancedProtectedRoute';
import { getCoachById } from '@/data/coaches';
import BookingFlow from '@/components/BookingFlow';

// Import debug commands in development
if (import.meta.env.DEV) {
  import('./lib/debug-commands');
}

// Layouts
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

// Public Pages
import { HomePage } from '@/pages/HomePage';
import { DiscoverPage } from '@/pages/DiscoverPage';
import CoachLandingPage from '@/components/CoachLandingPage';

// Auth Pages
import AuthPage from './pages/AuthPage';
import { LoginPage } from './pages/auth/LoginPage';

// Coach Pages
import { AnalyticsDashboard } from '@/pages/coach/AnalyticsDashboard';
import ClientsPage from '@/pages/coach/ClientsPage';
import NewClientPage from '@/pages/coach/NewClientPage';
import SessionsPage from '@/pages/coach/SessionsPage';
import ProgramsPage from '@/pages/coach/ProgramsPage';
import MessagesPage from '@/pages/coach/MessagesPage';
import ProfilePage from '@/pages/coach/ProfilePage';
import {
  ClientDetailPage,
  NewSessionPage,
  SessionDetailPage,
  NewProgramPage,
  ProgramDetailPage,
  AnalyticsPage,
  ResourcesPage,
  BillingPage,
  SettingsPage,
  SecurityPage,
  HelpPage
} from '@/pages/coach/PlaceholderPages';
import CoachWaveDebugDashboard from '@/components/CoachWaveDebugDashboard';

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
            <Route path="/login" element={<LoginPage />} />

            {/* Debug Route - Development only */}
            <Route path="/debug" element={<CoachWaveDebugDashboard />} />

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
              
              {/* Gestión de clientes */}
              <Route path="clients" element={<ClientsPage />} />
              <Route path="clients/new" element={<NewClientPage />} />
              <Route path="clients/:id" element={<ClientDetailPage />} />
              
              {/* Gestión de sesiones */}
              <Route path="sessions" element={<SessionsPage />} />
              <Route path="sessions/new" element={<NewSessionPage />} />
              <Route path="sessions/:id" element={<SessionDetailPage />} />
              
              {/* Programas de entrenamiento */}
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="programs/new" element={<NewProgramPage />} />
              <Route path="programs/:id" element={<ProgramDetailPage />} />
              
              {/* Analytics */}
              <Route path="analytics" element={<AnalyticsPage />} />
              
              {/* Mensajes */}
              <Route path="messages" element={<MessagesPage />} />
              
              {/* Recursos */}
              <Route path="resources" element={<ResourcesPage />} />
              
              {/* Facturación */}
              <Route path="billing" element={<BillingPage />} />
              
              {/* Configuración del perfil */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="security" element={<SecurityPage />} />
              <Route path="help" element={<HelpPage />} />
            </Route>

            {/* Legacy coach pages (outside main layout for full-screen experience) */}
            <Route path="/coaches/:coachId" element={<CoachLandingPageRoute />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Route Debugger - Development only */}
          {import.meta.env.DEV && <RouteDebugger />}
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
