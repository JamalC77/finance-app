"use client";

import type { PitchContent } from "./types";

interface ProspectEstimatesProps {
  pitch: PitchContent;
}

export function ProspectEstimates({ pitch }: ProspectEstimatesProps) {
  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Estimates Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-muted-foreground mb-6">
            Here&apos;s what we estimate:
          </h2>

          <div className="space-y-6">
            {pitch.estimates.map((estimate, index) => (
              <div key={index} className="border-l-2 border-primary/40 pl-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-muted-foreground">{estimate.label}:</span>
                  <span className="text-xl font-bold text-foreground">{estimate.value}</span>
                </div>
                {estimate.caveat && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {estimate.caveat}
                  </p>
                )}
                {estimate.kicker && (
                  <p className="text-sm text-primary font-medium mt-2 italic">
                    {estimate.kicker}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What We'd Build Section */}
        <div className="bg-white/[0.02] border border-border/40 rounded-xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            What we&apos;d build for you:
          </h3>
          <ul className="space-y-3">
            {pitch.whatWeBuild.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
