// Types for our data structures
export interface User {
  university: string;
  role: 'coordinator' | 'student';
  name: string;
  email: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface Event {
  id: string;
  clubId: string;
  clubName: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  googleFormLink: string;
  registrations: number;
  createdAt: string;
}

export interface Announcement {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Registration {
  eventId: string;
  userId: string;
  registeredAt: string;
}

// Storage keys
const KEYS = {
  USER: 'club_system_user',
  CLUBS: 'club_system_clubs',
  EVENTS: 'club_system_events',
  ANNOUNCEMENTS: 'club_system_announcements',
  REGISTRATIONS: 'club_system_registrations',
  LAST_EVENT_COUNT: 'club_system_last_event_count',
  LAST_ANNOUNCEMENT_COUNT: 'club_system_last_announcement_count',
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// User operations
export const getUser = (): User | null => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setUser = (user: User): void => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
  window.dispatchEvent(new StorageEvent('storage', { key: KEYS.USER }));
};

export const clearUser = (): void => {
  localStorage.removeItem(KEYS.USER);
  window.dispatchEvent(new StorageEvent('storage', { key: KEYS.USER }));
};

// Club operations
export const getClubs = (): Club[] => {
  const data = localStorage.getItem(KEYS.CLUBS);
  return data ? JSON.parse(data) : [];
};

export const addClub = (club: Omit<Club, 'id' | 'createdAt'>): Club => {
  const clubs = getClubs();
  const newClub: Club = {
    ...club,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  clubs.push(newClub);
  localStorage.setItem(KEYS.CLUBS, JSON.stringify(clubs));
  window.dispatchEvent(new StorageEvent('storage', { key: KEYS.CLUBS }));
  return newClub;
};

// Event operations
export const getEvents = (): Event[] => {
  const data = localStorage.getItem(KEYS.EVENTS);
  return data ? JSON.parse(data) : [];
};

export const addEvent = (event: Omit<Event, 'id' | 'createdAt' | 'registrations'>): Event => {
  const events = getEvents();
  const newEvent: Event = {
    ...event,
    id: generateId(),
    registrations: 0,
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  window.dispatchEvent(new StorageEvent('storage', { key: KEYS.EVENTS }));
  return newEvent;
};

export const incrementEventRegistration = (eventId: string): void => {
  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex !== -1) {
    events[eventIndex].registrations += 1;
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
    window.dispatchEvent(new StorageEvent('storage', { key: KEYS.EVENTS }));
  }
};

// Announcement operations
export const getAnnouncements = (): Announcement[] => {
  const data = localStorage.getItem(KEYS.ANNOUNCEMENTS);
  return data ? JSON.parse(data) : [];
};

export const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>): Announcement => {
  const announcements = getAnnouncements();
  const newAnnouncement: Announcement = {
    ...announcement,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  announcements.push(newAnnouncement);
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  window.dispatchEvent(new StorageEvent('storage', { key: KEYS.ANNOUNCEMENTS }));
  return newAnnouncement;
};

// Registration operations
export const getRegistrations = (): Registration[] => {
  const data = localStorage.getItem(KEYS.REGISTRATIONS);
  return data ? JSON.parse(data) : [];
};

export const addRegistration = (eventId: string, userId: string): void => {
  const registrations = getRegistrations();
  const exists = registrations.some(r => r.eventId === eventId && r.userId === userId);
  if (!exists) {
    registrations.push({
      eventId,
      userId,
      registeredAt: new Date().toISOString(),
    });
    localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(registrations));
    incrementEventRegistration(eventId);
  }
};

export const isRegistered = (eventId: string, userId: string): boolean => {
  const registrations = getRegistrations();
  return registrations.some(r => r.eventId === eventId && r.userId === userId);
};

// Google Calendar URL generator
export const generateGoogleCalendarUrl = (event: Event): string => {
  const startDate = new Date(`${event.date}T${event.time}`);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
  
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
  };
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: `Event by ${event.clubName}`,
    location: event.venue,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Notification tracking
export const getLastEventCount = (): number => {
  const data = localStorage.getItem(KEYS.LAST_EVENT_COUNT);
  return data ? parseInt(data, 10) : 0;
};

export const setLastEventCount = (count: number): void => {
  localStorage.setItem(KEYS.LAST_EVENT_COUNT, count.toString());
};

export const getLastAnnouncementCount = (): number => {
  const data = localStorage.getItem(KEYS.LAST_ANNOUNCEMENT_COUNT);
  return data ? parseInt(data, 10) : 0;
};

export const setLastAnnouncementCount = (count: number): void => {
  localStorage.setItem(KEYS.LAST_ANNOUNCEMENT_COUNT, count.toString());
};

// Storage event keys for listeners
export const STORAGE_KEYS = KEYS;
