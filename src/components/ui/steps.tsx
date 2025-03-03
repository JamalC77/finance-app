"use client";

import React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepsProps {
  steps: string[];
  currentStep: number;
  completedSteps: number[];
}

export function Steps({ steps, currentStep, completedSteps }: StepsProps) {
  return (
    <div className="flex w-full items-center">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step Circle */}
          <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center">
            <div
              className={cn(
                "h-8 w-8 rounded-full border-2 flex items-center justify-center",
                index === currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : completedSteps.includes(index)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/20"
              )}
            >
              {completedSteps.includes(index) ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
          </div>

          {/* Step Title (Visible on md and larger screens) */}
          <div className="ml-2 hidden md:block">
            <p
              className={cn(
                "text-xs font-medium",
                index === currentStep || completedSteps.includes(index)
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </p>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-[2px] flex-1 mx-2",
                completedSteps.includes(index)
                  ? "bg-primary"
                  : "bg-muted-foreground/20"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
} 