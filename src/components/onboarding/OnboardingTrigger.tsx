"use client";

import React, { useEffect, useState } from 'react';
import { useOnboarding } from '@/lib/contexts/OnboardingContext';
import OnboardingFlow from './OnboardingFlow';

export default function OnboardingTrigger() {
  const { isOnboardingComplete, skipOnboarding } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check if we should show onboarding when the component mounts
  useEffect(() => {
    // Get the onboarded status from localStorage to persist across sessions
    const onboardedBefore = localStorage.getItem('onboardingShown');
    
    // Only show onboarding if:
    // 1. It's not already complete
    // 2. It hasn't been shown before
    if (!isOnboardingComplete && !onboardedBefore) {
      // Wait a bit to show the onboarding modal (allows the page to render first)
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnboardingComplete]);
  
  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingShown', 'true');
    setShowOnboarding(false);
  };
  
  const handleOnboardingSkip = () => {
    localStorage.setItem('onboardingShown', 'true');
    setShowOnboarding(false);
  };
  
  if (!showOnboarding) {
    return null;
  }
  
  return (
    <OnboardingFlow 
      onComplete={handleOnboardingComplete} 
      onSkip={handleOnboardingSkip} 
    />
  );
} 