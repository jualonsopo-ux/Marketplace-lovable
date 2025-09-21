import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { DiscoverPage } from '@/pages/DiscoverPage';
import CoachLandingPage from '@/components/CoachLandingPage';
import BookingFlow from '@/components/BookingFlow';
import { getCoachById } from '@/data/coaches';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        {/* Authentication route */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Legacy route - keeping for now */}
        <Route path="/legacy" element={<Index />} />
        
        {/* Coach Landing Pages (outside main layout for full-screen experience) */}
        <Route path="/coaches/:coachId" element={<CoachLandingPageRoute />} />
        <Route path="/coaches/:coachId/book" element={<BookingFlowRoute />} />
        
        {/* Main Application Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/sessions" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Mis Sesiones</h1>
                  <p className="text-muted-foreground">Página en construcción - Próximamente con TanStack Query</p>
                </div>
              } />
              <Route path="/profile" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
                  <p className="text-muted-foreground">Página en construcción - Próximamente con TanStack Query</p>
                </div>
              } />
              <Route path="/settings" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Configuración</h1>
                  <p className="text-muted-foreground">Página en construcción - Próximamente con TanStack Query</p>
                </div>
              } />
              <Route path="/payments" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Pagos</h1>
                  <p className="text-muted-foreground">Página en construcción - Próximamente con TanStack Query</p>
                </div>
              } />
              <Route path="/support" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Soporte</h1>
                  <p className="text-muted-foreground">Página en construcción - Próximamente con TanStack Query</p>
                </div>
              } />
              
              {/* Coach Dashboard Routes */}
              <Route path="/coach/dashboard" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Dashboard de Coach</h1>
                  <p className="text-muted-foreground">Página en construcción - Próximamente con TanStack Query</p>
                </div>
              } />
              <Route path="/coach/calendar" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Calendario</h1>
                  <p className="text-muted-foreground">Página en construcción - Próximamente con TanStack Query</p>
                </div>
              } />
              <Route path="/coach/clients" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Mis Clientes</h1>
                  <p className="text-muted-foreground">Página en construcción - Próximamente con TanStack Query</p>
                </div>
              } />
              <Route path="/coach/earnings" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Ingresos</h1>
                  <p className="text-muted-foreground">Página en construcción - Próximamente con TanStack Query</p>
                </div>
              } />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
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
        window.location.href = '/';
      }}
    />
  );
}

export default App;
