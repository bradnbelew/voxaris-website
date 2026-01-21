import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Link2, 
  Settings,
  LogOut,
  FlaskConical,
  Code
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
    title: 'Agent Test Lab',
    icon: FlaskConical,
    href: '/dashboard/agent-test',
  },
  {
    title: 'Developers',
    icon: Code,
    href: '/dashboard/developers',
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
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-ink">
      <SidebarHeader className="border-b border-white/10 p-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          {isCollapsed ? (
            <img src={voxarisIcon} alt="V" className="h-8 w-8 invert" />
          ) : (
            <>
              <img src={voxarisLogo} alt="Voxaris" className="h-8 invert" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Suite</span>
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
                            ? 'bg-white text-ink'
                            : 'text-white/60 hover:bg-white/10 hover:text-white'
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

      <SidebarFooter className="border-t border-white/10 p-4">
        <div className={cn('flex items-center gap-3 mb-4', isCollapsed && 'justify-center')}>
          <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-white">
              {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.display_name || 'User'}</p>
              <p className="text-xs text-white/50 truncate">Dashboard</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size={isCollapsed ? 'icon' : 'default'}
          onClick={handleSignOut}
          className={cn('w-full text-white/60 hover:text-white hover:bg-white/10', isCollapsed && 'w-10')}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
