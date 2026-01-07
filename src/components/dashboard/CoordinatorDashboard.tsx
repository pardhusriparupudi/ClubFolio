import { useState, useEffect } from 'react';
import { Users, Calendar, Megaphone, TrendingUp } from 'lucide-react';
import { getClubs, getEvents, getAnnouncements, STORAGE_KEYS } from '@/lib/storage';

export const CoordinatorDashboard = () => {
  const [stats, setStats] = useState({
    clubs: 0,
    events: 0,
    announcements: 0,
    totalRegistrations: 0,
  });

  const loadStats = () => {
    const clubs = getClubs();
    const events = getEvents();
    const announcements = getAnnouncements();
    const totalRegistrations = events.reduce((sum, e) => sum + e.registrations, 0);

    setStats({
      clubs: clubs.length,
      events: events.length,
      announcements: announcements.length,
      totalRegistrations,
    });
  };

  useEffect(() => {
    loadStats();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
        loadStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const statCards = [
    { label: 'Active Clubs', value: stats.clubs, icon: Users, color: 'text-accent' },
    { label: 'Total Events', value: stats.events, icon: Calendar, color: 'text-primary' },
    { label: 'Announcements', value: stats.announcements, icon: Megaphone, color: 'text-warning' },
    { label: 'Total Registrations', value: stats.totalRegistrations, icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Coordinator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your clubs, events, and announcements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="card-elevated p-6 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-3xl font-bold text-foreground">
                {stat.value}
              </span>
            </div>
            <p className="text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card-elevated p-6">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Quick Tips
        </h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-bold shrink-0">1</span>
            <span>Create clubs using the <strong className="text-foreground">Manage Clubs</strong> tab</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-bold shrink-0">2</span>
            <span>Add events with Google Form links for registrations</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-bold shrink-0">3</span>
            <span>Post announcements to keep students informed</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
