import { useState, useEffect } from 'react';
import { Users, Calendar, Megaphone, Star } from 'lucide-react';
import { getClubs, getEvents, getAnnouncements, getRegistrations, getUser, STORAGE_KEYS } from '@/lib/storage';

export const StudentDashboard = () => {
  const [stats, setStats] = useState({
    clubs: 0,
    upcomingEvents: 0,
    announcements: 0,
    myRegistrations: 0,
  });

  const loadStats = () => {
    const user = getUser();
    const clubs = getClubs();
    const events = getEvents();
    const announcements = getAnnouncements();
    const registrations = getRegistrations();
    
    const myRegistrations = user 
      ? registrations.filter(r => r.userId === user.email).length 
      : 0;

    const upcomingEvents = events.filter(
      e => new Date(`${e.date}T${e.time}`) > new Date()
    ).length;

    setStats({
      clubs: clubs.length,
      upcomingEvents,
      announcements: announcements.length,
      myRegistrations,
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
    { label: 'Available Clubs', value: stats.clubs, icon: Users, color: 'text-accent' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: Calendar, color: 'text-primary' },
    { label: 'Announcements', value: stats.announcements, icon: Megaphone, color: 'text-warning' },
    { label: 'My Registrations', value: stats.myRegistrations, icon: Star, color: 'text-success' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Student Dashboard
        </h1>
        <p className="text-muted-foreground">
          Discover clubs and stay updated with campus activities
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
          Getting Started
        </h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">1</span>
            <span>Browse available clubs and learn about their activities</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">2</span>
            <span>Register for events using the provided Google Forms</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">3</span>
            <span>Add events to your Google Calendar with one click</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
