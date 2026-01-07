import { useState, useEffect } from 'react';
import { Plus, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Announcement, getAnnouncements, getClubs, STORAGE_KEYS } from '@/lib/storage';
import { CreateAnnouncementDialog } from './CreateAnnouncementDialog';
import { format } from 'date-fns';

interface AnnouncementListProps {
  isCoordinator: boolean;
}

export const AnnouncementList = ({ isCoordinator }: AnnouncementListProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const loadAnnouncements = () => {
    const sorted = getAnnouncements().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setAnnouncements(sorted);
  };

  useEffect(() => {
    loadAnnouncements();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ANNOUNCEMENTS) {
        loadAnnouncements();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const hasClubs = getClubs().length > 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Announcements
          </h1>
          <p className="text-muted-foreground">
            {isCoordinator 
              ? 'Post announcements for your clubs' 
              : 'Stay updated with the latest news'}
          </p>
        </div>
        {isCoordinator && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="btn-gradient-accent gap-2"
            disabled={!hasClubs}
          >
            <Plus className="w-4 h-4" />
            Post Announcement
          </Button>
        )}
      </div>

      {!hasClubs && isCoordinator && (
        <div className="card-elevated p-6 mb-6 border-warning/30 bg-warning/5">
          <p className="text-warning font-medium">
            You need to create a club first before you can post announcements.
          </p>
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <Megaphone className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No announcements yet
          </h3>
          <p className="text-muted-foreground">
            {isCoordinator 
              ? 'Post your first announcement to keep students informed' 
              : 'Check back later for announcements'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className="card-elevated p-6 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                  {announcement.clubName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(announcement.createdAt), 'MMM d, yyyy · h:mm a')}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {announcement.title}
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {isCoordinator && (
        <CreateAnnouncementDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={loadAnnouncements}
        />
      )}
    </div>
  );
};
