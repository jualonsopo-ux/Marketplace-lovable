import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  CreditCard, 
  Users, 
  Calendar, 
  Zap, 
  BarChart3, 
  Settings,
  ChevronLeft,
  MessageCircle
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { id: 'inicio', label: 'Inicio', icon: Home, active: true },
  { id: 'pagos', label: 'Pagos', icon: CreditCard },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'calendario', label: 'Calendario', icon: Calendar },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'automatizaciones', label: 'Automatizaciones', icon: Zap },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
];

interface DashboardSidebarProps {
  currentPage?: string;
  onPageChange?: (pageId: string) => void;
}

export default function DashboardSidebar({ currentPage = 'inicio', onPageChange }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-sidebar border-r border-border transition-all duration-200 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">Marketplace</h2>
                <p className="text-xs text-muted-foreground">Coaching</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-sidebar-hover text-sidebar-foreground"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange?.(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              "hover:bg-sidebar-hover",
              currentPage === item.id 
                ? "bg-sidebar-active-bg text-sidebar-active font-medium" 
                : "text-sidebar-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>¡Excelente mes!</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">+24% de ingresos</p>
        </div>
      )}
    </aside>
  );
}