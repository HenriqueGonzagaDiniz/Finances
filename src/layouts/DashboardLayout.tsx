import type { ReactNode } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto px-container-margin pt-base pb-32 w-full">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
