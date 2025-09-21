import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  Database,
  TrendingUp,
  ChevronLeft,
  UserCheck,
  Crown,
  Eye,
  FileText,
  AlertTriangle,
  Activity,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Shield },
  { name: "Coaches", href: "/admin/coaches", icon: UserCheck },
  { name: "Clientes", href: "/admin/clients", icon: Users },
  { name: "Vista Coach", href: "/coach/dashboard", icon: Eye },
  { name: "Vista Cliente", href: "/client/dashboard", icon: Eye },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reportes", href: "/admin/reports", icon: FileText },
  { name: "Actividad", href: "/admin/activity", icon: Activity },
  { name: "Base de Datos", href: "/admin/database", icon: Database },
  { name: "Configuración", href: "/admin/settings", icon: Settings },
  { name: "Alertas", href: "/admin/alerts", icon: AlertTriangle },
];

export function AdminDashboardLayout() {
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
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-warning to-warning/80 rounded-lg">
                <Crown className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">CoachWave</h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
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
                    ? "bg-gradient-to-r from-warning/10 to-transparent text-warning border-r-2 border-warning"
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center">
                <span className="text-sm font-medium text-warning-foreground">
                  {profile?.full_name?.[0] || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className={cn("mb-2", sidebarCollapsed ? "px-2" : "w-full")}
            onClick={() => navigate('/role-switch')}
          >
            <RotateCcw className={cn("w-4 h-4", !sidebarCollapsed && "mr-2")} />
            {!sidebarCollapsed && "Cambiar Vista"}
          </Button>
          
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