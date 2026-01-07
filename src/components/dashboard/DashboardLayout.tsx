import { useState, useEffect } from 'react';
import { User, getEvents, getAnnouncements, getLastEventCount, setLastEventCount, getLastAnnouncementCount, setLastAnnouncementCount, STORAGE_KEYS } from '@/lib/storage';
import { Sidebar } from './Sidebar';
import { CoordinatorDashboard } from './CoordinatorDashboard';
import { StudentDashboard } from './StudentDashboard';
import { ClubList } from '../clubs/ClubList';
import { EventList } from '../events/EventList';
import { AnnouncementList } from '../announcements/AnnouncementList';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  user: User;
}

export const DashboardLayout = ({ user }: DashboardLayoutProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isCoordinator = user.role === 'coordinator';

  // Notification system for students
  useEffect(() => {
    if (isCoordinator) return;

    // Initialize counts
    const currentEvents = getEvents().length;
    const currentAnnouncements = getAnnouncements().length;
    
    const lastEventCount = getLastEventCount();
    const lastAnnouncementCount = getLastAnnouncementCount();

    // Set initial counts if first visit
    if (lastEventCount === 0 && currentEvents > 0) {
      setLastEventCount(currentEvents);
    }
    if (lastAnnouncementCount === 0 && currentAnnouncements > 0) {
      setLastAnnouncementCount(currentAnnouncements);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.EVENTS) {
        const newEvents = getEvents().length;
        const lastCount = getLastEventCount();
        if (newEvents > lastCount) {
          toast.info('🎉 New event added!', {
            description: 'Check out the latest events.',
            duration: 5000,
          });
          setLastEventCount(newEvents);
        }
      }
      
      if (e.key === STORAGE_KEYS.ANNOUNCEMENTS) {
        const newAnnouncements = getAnnouncements().length;
        const lastCount = getLastAnnouncementCount();
        if (newAnnouncements > lastCount) {
          toast.info('📢 New announcement!', {
            description: 'Check the announcements tab for details.',
            duration: 5000,
          });
          setLastAnnouncementCount(newAnnouncements);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isCoordinator]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return isCoordinator ? <CoordinatorDashboard /> : <StudentDashboard />;
      case 'clubs':
        return <ClubList isCoordinator={isCoordinator} />;
      case 'events':
        return <EventList isCoordinator={isCoordinator} />;
      case 'my-events':
        return <EventList isCoordinator={false} showMyEvents />;
      case 'announcements':
        return <AnnouncementList isCoordinator={isCoordinator} />;
      default:
        return isCoordinator ? <CoordinatorDashboard /> : <StudentDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
