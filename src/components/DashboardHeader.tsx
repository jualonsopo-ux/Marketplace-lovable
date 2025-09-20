import { Search, Calendar, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  actions?: React.ReactNode;
}

export default function DashboardHeader({ title, subtitle, showSearch = true, actions }: DashboardHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        {(showSearch || actions) && (
          <div className="flex items-center justify-between gap-4">
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Buscar por cliente, email, ID de pago..." 
                  className="pl-9"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                28 días
              </Button>
              {actions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}