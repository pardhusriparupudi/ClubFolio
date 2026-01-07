import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addEvent, getClubs } from '@/lib/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateEventDialog = ({ open, onOpenChange, onSuccess }: CreateEventDialogProps) => {
  const [name, setName] = useState('');
  const [clubId, setClubId] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [googleFormLink, setGoogleFormLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clubs = getClubs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !clubId || !date || !time || !venue.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const selectedClub = clubs.find(c => c.id === clubId);
    
    addEvent({
      name: name.trim(),
      clubId,
      clubName: selectedClub?.name || 'Unknown Club',
      date: format(date, 'yyyy-MM-dd'),
      time,
      venue: venue.trim(),
      googleFormLink: googleFormLink.trim(),
    });

    toast.success('Event created successfully!');
    
    // Reset form
    setName('');
    setClubId('');
    setDate(undefined);
    setTime('');
    setVenue('');
    setGoogleFormLink('');
    setIsSubmitting(false);
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name *</Label>
            <Input
              id="eventName"
              placeholder="e.g., Annual Photography Exhibition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Club *</Label>
            <Select value={clubId} onValueChange={setClubId}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a club" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventTime">Time *</Label>
              <Input
                id="eventTime"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventVenue">Venue *</Label>
            <Input
              id="eventVenue"
              placeholder="e.g., Main Auditorium, Building A"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleFormLink">Google Form Link (for registration)</Label>
            <Input
              id="googleFormLink"
              type="url"
              placeholder="https://forms.google.com/..."
              value={googleFormLink}
              onChange={(e) => setGoogleFormLink(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient-accent"
            >
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
