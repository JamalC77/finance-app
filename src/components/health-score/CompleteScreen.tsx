"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { LandingHeader } from "./LandingHeader";
import { API_CONFIG } from "@/lib/config";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/thecfoline/diagnostic";

interface ScoreResult {
  compositeScore: number;
  letterGrade: string;
  runwayLabel: string;
  companyName: string;
}

export function CompleteScreen() {
  const searchParams = useSearchParams();
  const prospectId =
    searchParams.get("id") ||
    (typeof window !== "undefined"
      ? localStorage.getItem("cfoline_health_score_id")
      : null);

  const [result, setResult] = useState<ScoreResult | null>(null);

  useEffect(() => {
    if (!prospectId) return;

    const fetchResult = async () => {
      try {
        const res = await fetch(
          `${API_CONFIG.BASE_URL}/api/public/health-score/${prospectId}/result`
        );
        if (res.ok) {
          const data = await res.json();
          setResult(data);
        }
      } catch {
        // Non-critical — page still shows "check email" message
      }
    };

    fetchResult();
  }, [prospectId]);

  const gradeColor =
    result && result.compositeScore >= 70
      ? "text-green-500"
      : result && result.compositeScore >= 40
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md">
          <div className="p-8 rounded-xl border border-border bg-card text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-foreground mb-2">
              Your Financial Health Score is ready
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Check your email for the full report.
            </p>

            {/* Score teaser */}
            {result && (
              <div className="mb-8 p-6 rounded-lg bg-muted/30 border border-border/50">
                <div className={`text-5xl font-bold ${gradeColor}`}>
                  {result.compositeScore}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  out of 100
                </div>
                <div
                  className={`mt-3 inline-block px-3 py-1 rounded border-2 ${
                    result.compositeScore >= 70
                      ? "border-green-500/50"
                      : result.compositeScore >= 40
                        ? "border-yellow-500/50"
                        : "border-red-500/50"
                  }`}
                >
                  <span className={`text-lg font-bold ${gradeColor}`}>
                    {result.letterGrade}
                  </span>
                </div>
                {result.companyName && (
                  <div className="text-xs text-muted-foreground mt-3">
                    {result.companyName}
                  </div>
                )}
              </div>
            )}

            {/* Calendly CTA */}
            <p className="text-sm text-muted-foreground mb-4">
              Want to discuss your results with a CFO?
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors btn-shine"
            >
              Book a Free Strategy Call
              <ArrowRight className="h-4 w-4" />
            </a>

            <p className="mt-6 text-xs text-muted-foreground">
              Your QuickBooks data has been analyzed and deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
