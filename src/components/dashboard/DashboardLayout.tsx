import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import DashboardSidebar from './DashboardSidebar';
import { VoxarisCopilot } from '@/components/ui/VoxarisCopilot';
import { NeuralGrid } from '@/components/ui/NeuralGrid';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-ink text-white">
        <DashboardSidebar />
        <SidebarInset className="flex-1 relative">
          {/* Neural Grid Background */}
          <NeuralGrid opacity={0.5} />
          
          <header className="h-14 border-b border-white/10 bg-ink/80 backdrop-blur-sm flex items-center px-4 sticky top-0 z-10">
            <SidebarTrigger className="mr-4 text-white/70 hover:text-white" />
            <div className="flex-1" />
          </header>
          
          <main className="relative z-10 p-6">
            {children}
          </main>
        </SidebarInset>
        
        {/* Aizee Autonomous Copilot */}
        <VoxarisCopilot />
      </div>
    </SidebarProvider>
  );
}
