"use client";

import React, { useEffect, useState } from 'react';
import { useOnboarding } from '@/lib/contexts/OnboardingContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { quickbooksApi } from '@/lib/services/apiService';
import OnboardingFlow from './OnboardingFlow';

export default function OnboardingTrigger() {
  const { isOnboardingComplete, skipOnboarding } = useOnboarding();
  const auth = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCheckedSetup, setHasCheckedSetup] = useState(false);
  
  // Check if user is already set up (has QuickBooks connected)
  useEffect(() => {
    const checkUserSetup = async () => {
      // Get the onboarded status from localStorage to persist across sessions
      const onboardedBefore = localStorage.getItem('onboardingShown');
      
      // If already marked as shown or complete, don't show
      if (isOnboardingComplete || onboardedBefore) {
        setHasCheckedSetup(true);
        return;
      }
      
      // Check if user has QuickBooks connected - if they do, they're already set up
      if (auth.isAuthenticated && auth.token) {
        try {
          const connectionResponse = await quickbooksApi.getConnectionStatus(auth.token);
          
          // If QuickBooks is connected, user is already set up - skip onboarding
          if (connectionResponse.success && connectionResponse.data?.connected) {
            localStorage.setItem('onboardingShown', 'true');
            skipOnboarding();
            setHasCheckedSetup(true);
            return;
          }
        } catch (error) {
          // If we can't check, proceed with normal logic
          console.log('Could not check QuickBooks connection status');
        }
      }
      
      // If we get here, user needs onboarding
      setHasCheckedSetup(true);
      
      // Wait a bit to show the onboarding modal (allows the page to render first)
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    };
    
    if (auth.isAuthenticated && !auth.isLoading) {
      checkUserSetup();
    }
  }, [isOnboardingComplete, auth.isAuthenticated, auth.isLoading, auth.token, skipOnboarding]);
  
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
