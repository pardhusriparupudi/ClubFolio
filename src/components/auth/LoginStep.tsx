import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoginStepProps {
  university: string;
  role: 'coordinator' | 'student';
  onBack: () => void;
  onLogin: () => void;
}

export const LoginStep = ({ university, role, onBack, onLogin }: LoginStepProps) => {
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
            {role === 'coordinator' ? 'Coordinator Login' : 'Student Login'}
          </h1>
          <p className="text-muted-foreground">
            Sign in with your Google account to continue
          </p>
        </div>

        <Button
          onClick={onLogin}
          className="w-full h-14 bg-card hover:bg-secondary text-foreground border border-border gap-3 text-base font-medium transition-all duration-300 hover:shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </Button>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-medium text-foreground">Simulated Login:</span> This demo uses localStorage. Click the button to continue as a {role}.
          </p>
        </div>
      </div>
    </div>
  );
};
