import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Link2, 
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import voxarisLogo from '@/assets/voxaris-logo-dark.png';
import voxarisIcon from '@/assets/voxaris-icon-dark.png';

const menuItems = [
  {
    title: 'Command Center',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Agent Hiring Hall',
    icon: UserPlus,
    href: '/dashboard/hiring-hall',
  },
  {
    title: 'My Staff',
    icon: Users,
    href: '/dashboard/my-staff',
  },
  {
    title: 'Integrations',
    icon: Link2,
    href: '/dashboard/integrations',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export default function DashboardSidebar() {
  const location = useLocation();
  const { signOut, profile } = useAuthContext();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-frost">
      <SidebarHeader className="border-b border-frost p-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          {isCollapsed ? (
            <img src={voxarisIcon} alt="V" className="h-8 w-8" />
          ) : (
            <>
              <img src={voxarisLogo} alt="Voxaris" className="h-8" />
              <span className="text-xs font-semibold text-slate uppercase tracking-wider">Suite</span>
            </>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                          isActive
                            ? 'bg-foreground text-background'
                            : 'text-charcoal hover:bg-mist hover:text-foreground'
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-frost p-4">
        <div className={cn('flex items-center gap-3 mb-4', isCollapsed && 'justify-center')}>
          <div className="h-9 w-9 rounded-full bg-mist flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-charcoal">
              {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.display_name || 'User'}</p>
              <p className="text-xs text-slate truncate">Dashboard</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size={isCollapsed ? 'icon' : 'default'}
          onClick={handleSignOut}
          className={cn('w-full text-slate hover:text-foreground', isCollapsed && 'w-10')}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
