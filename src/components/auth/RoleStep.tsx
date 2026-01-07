import { Users, UserCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleStepProps {
  university: string;
  onBack: () => void;
  onNext: (role: 'coordinator' | 'student') => void;
}

export const RoleStep = ({ university, onBack, onNext }: RoleStepProps) => {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="glass-panel p-8 md:p-12 w-full max-w-lg animate-scale-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <p className="text-accent font-medium mb-2">{university}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Select Your Role
          </h1>
          <p className="text-muted-foreground">
            Choose how you'll be using ClubHub
          </p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => onNext('coordinator')}
            className="card-elevated p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-accent group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <UserCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  Club Coordinator
                </h3>
                <p className="text-muted-foreground text-sm">
                  Create and manage clubs, organize events, and post announcements
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNext('student')}
            className="card-elevated p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-primary group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  Student
                </h3>
                <p className="text-muted-foreground text-sm">
                  Discover clubs, register for events, and stay updated with announcements
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
