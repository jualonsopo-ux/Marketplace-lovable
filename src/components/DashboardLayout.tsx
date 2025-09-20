import { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage?: string;
  onPageChange?: (pageId: string) => void;
}

export default function DashboardLayout({ children, currentPage, onPageChange }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-dashboard-bg flex">
      <DashboardSidebar currentPage={currentPage} onPageChange={onPageChange} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}