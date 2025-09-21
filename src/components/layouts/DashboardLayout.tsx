import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Euro, 
  Settings, 
  Menu,
  LogOut,
  User
} from 'lucide-react';

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/coach/dashboard' },
  { icon: Calendar, label: 'Calendario', href: '/coach/calendar' },
  { icon: Users, label: 'Clientes', href: '/coach/clients' },
  { icon: Euro, label: 'Finanzas', href: '/coach/finances' },
  { icon: User, label: 'Perfil', href: '/coach/profile' },
  { icon: Settings, label: 'Configuración', href: '/coach/settings' },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Coach Dashboard</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate(item.href);
              setSidebarOpen(false);
            }}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {profile?.display_name?.[0] || profile?.user_id?.[0] || 'U'}
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium">{profile?.display_name || 'Usuario'}</p>
            <p className="text-muted-foreground">Coach</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col h-full border-r bg-background">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="flex flex-col flex-1">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <h1 className="text-lg font-semibold">CoachWave</h1>
          </header>
          
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>

        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </div>
  );
}