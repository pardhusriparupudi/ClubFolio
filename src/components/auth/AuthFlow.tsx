import { useState } from 'react';
import { UniversityStep } from './UniversityStep';
import { RoleStep } from './RoleStep';
import { LoginStep } from './LoginStep';
import { setUser, generateId } from '@/lib/storage';

interface AuthFlowProps {
  onComplete: () => void;
}

type Step = 'university' | 'role' | 'login';

export const AuthFlow = ({ onComplete }: AuthFlowProps) => {
  const [step, setStep] = useState<Step>('university');
  const [university, setUniversity] = useState('');
  const [role, setRole] = useState<'coordinator' | 'student'>('student');

  const handleUniversitySubmit = (name: string) => {
    setUniversity(name);
    setStep('role');
  };

  const handleRoleSelect = (selectedRole: 'coordinator' | 'student') => {
    setRole(selectedRole);
    setStep('login');
  };

  const handleLogin = () => {
    // Simulated Google login - create a fake user
    const fakeEmail = `${role}.${generateId().slice(0, 6)}@${university.toLowerCase().replace(/\s+/g, '')}.edu`;
    const fakeName = role === 'coordinator' ? 'Alex Morgan' : 'Jordan Smith';
    
    setUser({
      university,
      role,
      name: fakeName,
      email: fakeEmail,
    });
    
    onComplete();
  };

  const handleBack = () => {
    if (step === 'role') {
      setStep('university');
    } else if (step === 'login') {
      setStep('role');
    }
  };

  switch (step) {
    case 'university':
      return <UniversityStep onNext={handleUniversitySubmit} />;
    case 'role':
      return (
        <RoleStep
          university={university}
          onBack={handleBack}
          onNext={handleRoleSelect}
        />
      );
    case 'login':
      return (
        <LoginStep
          university={university}
          role={role}
          onBack={handleBack}
          onLogin={handleLogin}
        />
      );
    default:
      return null;
  }
};
