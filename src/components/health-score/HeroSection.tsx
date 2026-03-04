"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { EmailCaptureForm } from "./EmailCaptureForm";

function ScorePreview() {
  const categories = [
    { name: "Liquidity", score: 62, color: "bg-yellow-500" },
    { name: "Receivables", score: 38, color: "bg-red-500" },
    { name: "Revenue Trend", score: 71, color: "bg-green-500" },
    { name: "Profitability", score: 45, color: "bg-yellow-500" },
    { name: "Cash Runway", score: 48, color: "bg-yellow-500" },
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-primary/[0.04] rounded-3xl blur-2xl" />

      <div className="relative p-5 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-0.5">
              Health Score
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-yellow-500">54</span>
              <span className="text-xs text-muted-foreground/60">/ 100</span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded border border-yellow-500/30 bg-yellow-500/5">
            <span className="text-base font-bold text-yellow-500">C</span>
          </div>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2.5">
              <div className="w-[88px] text-[11px] text-muted-foreground/70 truncate">
                {cat.name}
              </div>
              <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.color}`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
              <div className="w-5 text-[11px] text-muted-foreground/60 text-right tabular-nums">
                {cat.score}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-[11px] text-yellow-500 font-medium">
            Needs Attention
          </span>
        </div>

        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded text-[9px] font-medium bg-muted/80 text-muted-foreground border border-border/40">
          Sample
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-20 px-4 gradient-hero overflow-hidden">
      <div className="absolute inset-0 pattern-grid" />

      <div className="relative container mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 items-center">
          {/* Left */}
          <div>
            <div className="inline-block px-2.5 py-1 rounded-full border border-border/30 bg-muted/20 text-[11px] font-medium text-muted-foreground/70 mb-5">
              Free for QuickBooks users
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium text-foreground tracking-tight leading-[1.15]">
              Is your business
              <br />
              <span className="italic text-foreground/70">
                financially healthy?
              </span>
            </h1>

            <p className="mt-4 text-base text-muted-foreground max-w-md">
              Get a 0–100 score across liquidity, receivables, revenue, profitability, and cash runway — delivered to your inbox in minutes.
            </p>

            <div className="mt-7">
              <EmailCaptureForm />
            </div>

            <div className="mt-3">
              <Link
                href="/health-score/example"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border/50 text-sm text-muted-foreground font-medium hover:text-foreground hover:border-border hover:bg-muted/20 transition-all"
              >
                <Eye className="h-3.5 w-3.5" />
                Show Me an Example
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:block">
            <ScorePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
