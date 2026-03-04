"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { EmailCaptureForm } from "./EmailCaptureForm";

// Mini score preview for the hero visual
function ScorePreview() {
  const categories = [
    { name: "Liquidity", score: 62, color: "bg-yellow-500" },
    { name: "Receivables", score: 38, color: "bg-red-500" },
    { name: "Revenue Trend", score: 71, color: "bg-green-500" },
    { name: "Profitability", score: 45, color: "bg-yellow-500" },
    { name: "Cash Runway", score: 48, color: "bg-yellow-500" },
  ];

  return (
    <div className="relative mx-auto max-w-sm">
      {/* Glow behind the card */}
      <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />

      <div className="relative p-6 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
        {/* Score + grade */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Health Score
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-yellow-500">54</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-md border-2 border-yellow-500/40">
            <span className="text-lg font-bold text-yellow-500">C</span>
          </div>
        </div>

        {/* Category bars */}
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div className="w-24 text-xs text-muted-foreground truncate">
                {cat.name}
              </div>
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.color}`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
              <div className="w-6 text-xs text-muted-foreground text-right">
                {cat.score}
              </div>
            </div>
          ))}
        </div>

        {/* Runway badge */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-xs text-yellow-500 font-medium">
            Needs Attention
          </span>
        </div>

        {/* Sample label */}
        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
          Sample Report
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 px-4 gradient-hero overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 pattern-grid" />

      <div className="relative container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy + form */}
          <div className="text-center lg:text-left">
            <div className="inline-block px-3 py-1 rounded-full border border-border/50 bg-muted/30 text-xs font-medium text-muted-foreground mb-6">
              Free for QuickBooks users
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-5xl font-medium text-foreground tracking-tight leading-[1.15]">
              Is your business
              <br />
              <span className="italic text-foreground/70">
                financially healthy?
              </span>
            </h1>

            <p className="mt-5 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Get a 0–100 score across liquidity, receivables, revenue, profitability, and cash runway — delivered to your inbox in minutes.
            </p>

            <div className="mt-8">
              <EmailCaptureForm />
            </div>

            <div className="mt-4 flex justify-center lg:justify-start">
              <Link
                href="/health-score/example"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted/30 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Show Me an Example
              </Link>
            </div>
          </div>

          {/* Right: score preview card */}
          <div className="hidden lg:block">
            <ScorePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
