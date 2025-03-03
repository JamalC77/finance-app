"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

type OnboardingContextType = {
  steps: OnboardingStep[];
  currentStepIndex: number;
  isOnboardingComplete: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  completeCurrentStep: () => void;
  skipOnboarding: () => void;
  restartOnboarding: () => void;
};

const defaultSteps: OnboardingStep[] = [
  {
    id: 'business-info',
    title: 'Business Information',
    description: 'Set up your business profile and basic information',
    completed: false,
  },
  {
    id: 'chart-of-accounts',
    title: 'Chart of Accounts',
    description: 'Configure your chart of accounts or use a template',
    completed: false,
  },
  {
    id: 'bank-connect',
    title: 'Connect Bank Accounts',
    description: 'Link your business bank accounts for automatic transaction import',
    completed: false,
  },
  {
    id: 'payment-setup',
    title: 'Payment Methods',
    description: 'Set up how you want to accept payments from clients',
    completed: false,
  },
  {
    id: 'invite-users',
    title: 'Invite Team Members',
    description: 'Add team members and set their permissions',
    completed: false,
  },
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Check local storage on mount
  useEffect(() => {
    const savedOnboarding = localStorage.getItem('onboarding');
    if (savedOnboarding) {
      const { steps: savedSteps, currentStepIndex: savedIndex } = JSON.parse(savedOnboarding);
      setSteps(savedSteps);
      setCurrentStepIndex(savedIndex);
    }
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    localStorage.setItem('onboarding', JSON.stringify({ steps, currentStepIndex }));
  }, [steps, currentStepIndex]);

  const isOnboardingComplete = steps.every(step => step.completed);

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const completeCurrentStep = () => {
    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex].completed = true;
    setSteps(updatedSteps);
    
    // Move to next step if possible
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const skipOnboarding = () => {
    const completedSteps = steps.map(step => ({ ...step, completed: true }));
    setSteps(completedSteps);
  };

  const restartOnboarding = () => {
    setSteps(defaultSteps);
    setCurrentStepIndex(0);
  };

  return (
    <OnboardingContext.Provider
      value={{
        steps,
        currentStepIndex,
        isOnboardingComplete,
        goToNextStep,
        goToPreviousStep,
        completeCurrentStep,
        skipOnboarding,
        restartOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
} 