import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Clock, ExternalLink, CalendarPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event, getEvents, getClubs, isRegistered, addRegistration, getUser, generateGoogleCalendarUrl, STORAGE_KEYS } from '@/lib/storage';
import { CreateEventDialog } from './CreateEventDialog';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface EventListProps {
  isCoordinator: boolean;
  showMyEvents?: boolean;
}

export const EventList = ({ isCoordinator, showMyEvents = false }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());

  const loadEvents = () => {
    const user = getUser();
    let allEvents = getEvents();
    
    if (showMyEvents && user) {
      const registeredIds = new Set<string>();
      allEvents.forEach(e => {
        if (isRegistered(e.id, user.email)) {
          registeredIds.add(e.id);
        }
      });
      setRegisteredEvents(registeredIds);
      allEvents = allEvents.filter(e => registeredIds.has(e.id));
    } else if (user) {
      const registeredIds = new Set<string>();
      allEvents.forEach(e => {
        if (isRegistered(e.id, user.email)) {
          registeredIds.add(e.id);
        }
      });
      setRegisteredEvents(registeredIds);
    }
    
    setEvents(allEvents.sort((a, b) => 
      new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
    ));
  };

  useEffect(() => {
    loadEvents();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.EVENTS || e.key === STORAGE_KEYS.REGISTRATIONS) {
        loadEvents();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [showMyEvents]);

  const handleRegister = (event: Event) => {
    const user = getUser();
    if (!user) return;

    // Open Google Form
    if (event.googleFormLink) {
      window.open(event.googleFormLink, '_blank');
    }

    // Record registration
    addRegistration(event.id, user.email);
    toast.success('Registration recorded! Complete the form to finalize.');
    loadEvents();
  };

  const handleAddToCalendar = (event: Event) => {
    const calendarUrl = generateGoogleCalendarUrl(event);
    window.open(calendarUrl, '_blank');
    toast.success('Opening Google Calendar...');
  };

  const hasClubs = getClubs().length > 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {showMyEvents ? 'My Registrations' : isCoordinator ? 'Manage Events' : 'Upcoming Events'}
          </h1>
          <p className="text-muted-foreground">
            {showMyEvents 
              ? 'Events you have registered for'
              : isCoordinator 
                ? 'Create and manage club events' 
                : 'Discover and register for events'}
          </p>
        </div>
        {isCoordinator && !showMyEvents && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="btn-gradient-accent gap-2"
            disabled={!hasClubs}
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        )}
      </div>

      {!hasClubs && isCoordinator && !showMyEvents && (
        <div className="card-elevated p-6 mb-6 border-warning/30 bg-warning/5">
          <p className="text-warning font-medium">
            You need to create a club first before you can create events.
          </p>
        </div>
      )}

      {events.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {showMyEvents ? 'No registrations yet' : 'No events yet'}
          </h3>
          <p className="text-muted-foreground">
            {showMyEvents 
              ? 'Register for events to see them here'
              : isCoordinator 
                ? 'Create your first event to get started' 
                : 'Check back later for upcoming events'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="card-elevated p-6 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      {event.clubName}
                    </span>
                    {isCoordinator && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                        <Users className="w-3 h-3" />
                        {event.registrations} registered
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {event.name}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.venue}
                    </span>
                  </div>
                </div>
                
                {!isCoordinator && (
                  <div className="flex gap-2">
                    {!registeredEvents.has(event.id) ? (
                      <Button
                        onClick={() => handleRegister(event)}
                        className="btn-gradient-accent gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Register
                      </Button>
                    ) : (
                      <span className="px-4 py-2 rounded-lg bg-success/10 text-success font-medium text-sm">
                        ✓ Registered
                      </span>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleAddToCalendar(event)}
                      className="gap-2"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      Add to Calendar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isCoordinator && (
        <CreateEventDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={loadEvents}
        />
      )}
    </div>
  );
};
