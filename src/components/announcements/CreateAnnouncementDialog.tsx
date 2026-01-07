import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addAnnouncement, getClubs } from '@/lib/storage';
import { toast } from 'sonner';

interface CreateAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateAnnouncementDialog = ({ open, onOpenChange, onSuccess }: CreateAnnouncementDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [clubId, setClubId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clubs = getClubs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !clubId) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    const selectedClub = clubs.find(c => c.id === clubId);
    
    addAnnouncement({
      title: title.trim(),
      content: content.trim(),
      clubId,
      clubName: selectedClub?.name || 'Unknown Club',
    });

    toast.success('Announcement posted successfully!');
    
    setTitle('');
    setContent('');
    setClubId('');
    setIsSubmitting(false);
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Post Announcement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
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

          <div className="space-y-2">
            <Label htmlFor="announcementTitle">Title *</Label>
            <Input
              id="announcementTitle"
              placeholder="e.g., Important Meeting Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcementContent">Content *</Label>
            <Textarea
              id="announcementContent"
              placeholder="Write your announcement here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
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
              Post Announcement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
