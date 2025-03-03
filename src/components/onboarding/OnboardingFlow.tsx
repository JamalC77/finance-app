"use client";

import React, { useState } from 'react';
import { useOnboarding } from '@/lib/contexts/OnboardingContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, ChevronRightIcon, ChevronLeftIcon, XIcon } from 'lucide-react';
import { Steps } from '@/components/ui/steps';
import BusinessInfoStep from './steps/BusinessInfoStep';
import ChartOfAccountsStep from './steps/ChartOfAccountsStep';
import BankConnectionStep from './steps/BankConnectionStep';
import PaymentSetupStep from './steps/PaymentSetupStep';
import InviteUsersStep from './steps/InviteUsersStep';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const { 
    steps, 
    currentStepIndex, 
    isOnboardingComplete,
    goToNextStep, 
    goToPreviousStep, 
    completeCurrentStep,
    skipOnboarding
  } = useOnboarding();
  
  // Track form validity for the current step
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  
  // Render current step content
  const renderStepContent = () => {
    const currentStep = steps[currentStepIndex];
    
    switch (currentStep.id) {
      case 'business-info':
        return <BusinessInfoStep onValidityChange={setIsCurrentStepValid} />;
      case 'chart-of-accounts':
        return <ChartOfAccountsStep onValidityChange={setIsCurrentStepValid} />;
      case 'bank-connect':
        return <BankConnectionStep onValidityChange={setIsCurrentStepValid} />;
      case 'payment-setup':
        return <PaymentSetupStep onValidityChange={setIsCurrentStepValid} />;
      case 'invite-users':
        return <InviteUsersStep onValidityChange={setIsCurrentStepValid} />;
      default:
        return <div>Unknown step</div>;
    }
  };
  
  const handleNextClick = () => {
    if (currentStepIndex === steps.length - 1) {
      // Last step
      completeCurrentStep();
      onComplete();
    } else {
      // Not last step
      completeCurrentStep();
    }
  };
  
  const handleSkip = () => {
    skipOnboarding();
    onSkip();
  };
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {steps[currentStepIndex].title}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleSkip}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="px-6 py-2">
          <Steps 
            steps={steps.map(step => step.title)} 
            currentStep={currentStepIndex}
            completedSteps={steps
              .map((step, index) => step.completed ? index : null)
              .filter((index): index is number => index !== null)}
          />
        </div>
        
        <CardContent className="py-4">
          {renderStepContent()}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button onClick={handleSkip} variant="ghost">
            Skip for now
          </Button>
          
          <Button 
            onClick={handleNextClick}
            disabled={!isCurrentStepValid}
          >
            {currentStepIndex === steps.length - 1 ? (
              <>
                Complete
                <CheckIcon className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 