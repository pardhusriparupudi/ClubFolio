import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Megaphone, 
  LogOut,
  GraduationCap,
  Plus
} from 'lucide-react';
import { User, clearUser } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface SidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ user, activeTab, onTabChange }: SidebarProps) => {
  const isCoordinator = user.role === 'coordinator';

  const coordinatorTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clubs', label: 'Manage Clubs', icon: Users },
    { id: 'events', label: 'Manage Events', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  const studentTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clubs', label: 'Browse Clubs', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'my-events', label: 'My Registrations', icon: Plus },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  const tabs = isCoordinator ? coordinatorTabs : studentTabs;

  const handleLogout = () => {
    clearUser();
    window.location.reload();
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-foreground">
              ClubHub
            </h1>
            <p className="text-xs text-sidebar-foreground/60 truncate max-w-[140px]">
              {user.university}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'sidebar-item w-full',
              activeTab === tab.id && 'active'
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-4 px-4">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user.name}
          </p>
          <p className="text-xs text-sidebar-foreground/60 truncate">
            {user.email}
          </p>
          <span className={cn(
            "inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium",
            isCoordinator 
              ? "bg-accent/20 text-accent" 
              : "bg-sidebar-primary/20 text-sidebar-primary"
          )}>
            {isCoordinator ? 'Coordinator' : 'Student'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
