"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { EmailCaptureForm } from "./EmailCaptureForm";

function ScorePreview() {
  const categories = [
    { name: "Liquidity", score: 62, color: "bg-yellow-500", delay: "0.3s" },
    { name: "Receivables", score: 38, color: "bg-red-500", delay: "0.5s" },
    { name: "Revenue Trend", score: 71, color: "bg-green-500", delay: "0.7s" },
    { name: "Profitability", score: 45, color: "bg-yellow-500", delay: "0.9s" },
    { name: "Cash Runway", score: 48, color: "bg-yellow-500", delay: "1.1s" },
  ];

  return (
    <div className="relative score-card-float">
      {/* Animated glow behind card */}
      <div className="absolute -inset-8 rounded-3xl score-glow" />

      <div className="relative p-6 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] mb-1">
              Health Score
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-yellow-500 score-number-enter">
                54
              </span>
              <span className="text-sm text-muted-foreground/50">/ 100</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl border-2 border-yellow-500/40 bg-yellow-500/10 flex items-center justify-center">
            <span className="text-xl font-bold text-yellow-500">C</span>
          </div>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div className="w-24 text-xs text-muted-foreground/70 truncate">
                {cat.name}
              </div>
              <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.color} score-bar-fill`}
                  style={
                    {
                      "--bar-width": `${cat.score}%`,
                      animationDelay: cat.delay,
                    } as React.CSSProperties
                  }
                />
              </div>
              <div className="w-6 text-xs text-muted-foreground/60 text-right tabular-nums font-medium">
                {cat.score}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-xs text-yellow-500 font-medium">
            Needs Attention
          </span>
        </div>

        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-muted/80 text-muted-foreground border border-border/40">
          Sample
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-56px)] flex items-center px-4 gradient-hero overflow-hidden">
      <div className="absolute inset-0 pattern-grid" />

      {/* Radial glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto max-w-6xl py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div className="hero-fade-in">
            <div className="inline-block px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary/80 mb-6">
              Free for QuickBooks users
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl font-medium text-foreground tracking-tight leading-[1.1]">
              Is your business
              <br />
              <span className="italic text-foreground/70">
                financially healthy?
              </span>
            </h1>

            <p className="mt-5 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Get a 0-100 score across liquidity, receivables, revenue,
              profitability, and cash runway — delivered to your inbox in
              minutes.
            </p>

            <div className="mt-8">
              <EmailCaptureForm />
            </div>

            <div className="mt-5 flex justify-center sm:justify-start">
              <Link
                href="/health-score/example"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border/50 text-sm text-muted-foreground font-medium hover:text-foreground hover:border-border hover:bg-muted/20 transition-all"
              >
                <Eye className="h-4 w-4" />
                Show Me an Example
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:flex justify-center">
            <div className="w-full max-w-[400px]">
              <ScorePreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
