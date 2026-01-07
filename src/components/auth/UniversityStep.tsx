import { useState } from 'react';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UniversityStepProps {
  onNext: (university: string) => void;
}

export const UniversityStep = ({ onNext }: UniversityStepProps) => {
  const [university, setUniversity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (university.trim()) {
      onNext(university.trim());
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="glass-panel p-8 md:p-12 w-full max-w-lg animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Welcome to ClubHub
          </h1>
          <p className="text-muted-foreground text-lg">
            Your campus activities, organized.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="university" className="block text-sm font-medium text-foreground mb-2">
              University Name
            </label>
            <Input
              id="university"
              type="text"
              placeholder="Enter your university name"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="h-12 text-base"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={!university.trim()}
            className="w-full h-12 btn-gradient-primary text-base gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Join thousands of students managing their campus life
        </p>
      </div>
    </div>
  );
};
