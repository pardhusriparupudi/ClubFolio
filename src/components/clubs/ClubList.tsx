import { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Club, getClubs, STORAGE_KEYS } from '@/lib/storage';
import { CreateClubDialog } from './CreateClubDialog';
import { format } from 'date-fns';

interface ClubListProps {
  isCoordinator: boolean;
}

export const ClubList = ({ isCoordinator }: ClubListProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const loadClubs = () => {
    setClubs(getClubs());
  };

  useEffect(() => {
    loadClubs();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.CLUBS) {
        loadClubs();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {isCoordinator ? 'Manage Clubs' : 'Available Clubs'}
          </h1>
          <p className="text-muted-foreground">
            {isCoordinator 
              ? 'Create and manage your university clubs' 
              : 'Discover clubs and their activities'}
          </p>
        </div>
        {isCoordinator && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="btn-gradient-accent gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Club
          </Button>
        )}
      </div>

      {clubs.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No clubs yet
          </h3>
          <p className="text-muted-foreground">
            {isCoordinator 
              ? 'Create your first club to get started' 
              : 'Check back later for available clubs'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club, index) => (
            <div
              key={club.id}
              className="card-elevated p-6 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {club.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {club.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Created {format(new Date(club.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          ))}
        </div>
      )}

      {isCoordinator && (
        <CreateClubDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={loadClubs}
        />
      )}
    </div>
  );
};
