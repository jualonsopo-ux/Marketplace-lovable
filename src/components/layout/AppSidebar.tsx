import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Search, 
  Calendar, 
  User, 
  CreditCard, 
  MessageCircle, 
  Settings,
  Star,
  TrendingUp 
} from 'lucide-react';

const navigationItems = [
  { title: 'Inicio', url: '/', icon: Home },
  { title: 'Descubrir', url: '/discover', icon: Search },
  { title: 'Mis Sesiones', url: '/sessions', icon: Calendar },
  { title: 'Perfil', url: '/profile', icon: User },
];

const coachItems = [
  { title: 'Dashboard', url: '/coach/dashboard', icon: TrendingUp },
  { title: 'Calendario', url: '/coach/calendar', icon: Calendar },
  { title: 'Clientes', url: '/coach/clients', icon: User },
  { title: 'Ingresos', url: '/coach/earnings', icon: CreditCard },
];

const supportItems = [
  { title: 'Pagos', url: '/payments', icon: CreditCard },
  { title: 'Soporte', url: '/support', icon: MessageCircle },
  { title: 'Configuración', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  const isCoachSectionActive = coachItems.some(item => isActive(item.url));

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="p-2">
        {/* Brand */}
        {!collapsed && (
          <div className="px-4 py-6">
            <h1 className="text-xl font-bold text-primary">CoachWave</h1>
            <p className="text-xs text-muted-foreground">Tu plataforma de coaching</p>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Coach Dashboard (only show if user is a coach) */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Coach Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coachItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Cuenta
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
