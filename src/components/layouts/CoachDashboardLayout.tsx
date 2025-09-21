import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  Calendar,
  Users,
  CreditCard,
  Settings,
  Menu,
  LogOut,
  User,
  TrendingUp,
  ChevronLeft,
  MessageSquare,
  BookOpen,
  FileText,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: "Dashboard", href: "/coach/dashboard", icon: BarChart3 },
  { name: "Clientes", href: "/coach/clients", icon: Users },
  { name: "Sesiones", href: "/coach/sessions", icon: Calendar },
  { name: "Programas", href: "/coach/programs", icon: BookOpen },
  { name: "Mensajes", href: "/coach/messages", icon: MessageSquare },
  { name: "Facturación", href: "/coach/billing", icon: CreditCard },
  { name: "Reportes", href: "/coach/analytics", icon: FileText },
  { name: "Perfil", href: "/coach/profile", icon: User },
  { name: "Configuración", href: "/coach/settings", icon: Settings },
  { name: "Ayuda", href: "/coach/help", icon: HelpCircle },
];

export function CoachDashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "relative h-screen bg-card border-r border-border transition-all duration-300 ease-smooth",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">CoachWave</h1>
                <p className="text-xs text-muted-foreground">Coach Dashboard</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="ml-auto p-1"
          >
            {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-transparent text-primary border-r-2 border-primary"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className={cn("flex-shrink-0 w-5 h-5", !sidebarCollapsed && "mr-3")} />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-border p-4">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {profile?.display_name?.[0] || 'C'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.display_name || 'Coach'}
                </p>
                <p className="text-xs text-muted-foreground">Coach</p>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className={cn("w-full", sidebarCollapsed && "px-2")}
            onClick={handleSignOut}
          >
            <LogOut className={cn("w-4 h-4", !sidebarCollapsed && "mr-2")} />
            {!sidebarCollapsed && "Cerrar Sesión"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}