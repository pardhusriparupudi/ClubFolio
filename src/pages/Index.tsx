import { useState, useEffect } from 'react';
import { AuthFlow } from '@/components/auth/AuthFlow';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { getUser, User, STORAGE_KEYS } from '@/lib/storage';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user
    const storedUser = getUser();
    setUser(storedUser);
    setIsLoading(false);

    // Listen for user changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.USER) {
        const updatedUser = getUser();
        setUser(updatedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAuthComplete = () => {
    const storedUser = getUser();
    setUser(storedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthFlow onComplete={handleAuthComplete} />;
  }

  return <DashboardLayout user={user} />;
};

export default Index;
