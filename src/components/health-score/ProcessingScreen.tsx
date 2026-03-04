"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Check, Circle, AlertTriangle } from "lucide-react";
import { LandingHeader } from "./LandingHeader";
import { API_CONFIG } from "@/lib/config";

const STEPS = [
  "Connecting to QuickBooks",
  "Pulling financial data",
  "Analyzing cash flow patterns",
  "Calculating health metrics",
  "Generating your report",
];

interface StatusResponse {
  status: string;
  step: number;
  companyName?: string;
  errorMessage?: string;
}

export function ProcessingScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prospectId =
    searchParams.get("id") ||
    (typeof window !== "undefined"
      ? localStorage.getItem("cfoline_health_score_id")
      : null);

  const [currentStep, setCurrentStep] = useState(0);
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  const poll = useCallback(async () => {
    if (!prospectId) return;

    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/public/health-score/${prospectId}/status`
      );
      if (!res.ok) return;

      const data: StatusResponse = await res.json();

      if (data.companyName) setCompanyName(data.companyName);

      if (data.status === "COMPLETED") {
        setCurrentStep(5);
        // Short delay so user sees the final checkmark
        setTimeout(() => {
          router.push(`/health-score/complete?id=${prospectId}`);
        }, 800);
        return;
      }

      if (data.status === "FAILED") {
        setFailed(true);
        setErrorMessage(data.errorMessage || "Something went wrong.");
        return;
      }

      // Map step (0-4 from backend)
      setCurrentStep(Math.max(data.step, 0));
    } catch {
      // Silent retry on network error
    }
  }, [prospectId, router]);

  useEffect(() => {
    if (!prospectId) return;

    // Initial poll
    poll();

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [prospectId, poll]);

  if (!prospectId) {
    return (
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground">No health score in progress.</p>
            <a
              href="/"
              className="mt-4 inline-block text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Start a new score
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md">
          <div className="p-8 rounded-xl border border-border bg-card text-center">
            {failed ? (
              <>
                <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Something went wrong
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {errorMessage}
                </p>
                <a
                  href="/"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </a>
              </>
            ) : (
              <>
                <Loader2 className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  {companyName
                    ? `Analyzing ${companyName}...`
                    : "Analyzing your financials..."}
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  This usually takes about 30 seconds.
                </p>

                {/* Step checklist */}
                <div className="space-y-3 text-left">
                  {STEPS.map((label, i) => {
                    const completed = i < currentStep;
                    const active = i === currentStep;

                    return (
                      <div key={i} className="flex items-center gap-3">
                        {completed ? (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : active ? (
                          <Loader2 className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            completed
                              ? "text-foreground"
                              : active
                                ? "text-foreground font-medium"
                                : "text-muted-foreground/60"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((currentStep / 5) * 100, 100)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
