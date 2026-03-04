"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { EmailCaptureForm } from "./EmailCaptureForm";

function ScorePreview() {
  const categories = [
    { name: "Liquidity", score: 62, color: "bg-yellow-500", delay: "0.3s" },
    { name: "Receivables", score: 38, color: "bg-red-500", delay: "0.5s" },
    {
      name: "Revenue Trend",
      score: 71,
      color: "bg-emerald-500",
      delay: "0.7s",
    },
    {
      name: "Profitability",
      score: 45,
      color: "bg-orange-500",
      delay: "0.9s",
    },
    { name: "Cash Runway", score: 48, color: "bg-yellow-500", delay: "1.1s" },
  ];

  return (
    <div className="relative score-card-float pt-4">
      {/* Animated glow behind card */}
      <div className="absolute -inset-10 top-0 rounded-3xl score-glow" />

      {/* Sample badge — outside the card so it's never clipped */}
      <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-slate-400 border border-white/[0.1] bg-[hsl(222_47%_10%)]">
        Sample Report
      </div>

      <div className="relative rounded-2xl border border-white/[0.08] bg-[hsl(222_47%_8%/0.9)] backdrop-blur-sm shadow-2xl">
        {/* Main content */}
        <div className="p-7 pb-5">
          <div className="mb-6">
            <div className="text-[11px] text-slate-500 uppercase tracking-[0.25em] mb-2 font-medium">
              Health Score
            </div>
            <div className="flex items-center gap-3">
              <span className="text-7xl font-bold text-yellow-500 score-number-enter tracking-tight">
                54
              </span>
              <span className="text-lg text-slate-600 font-light">
                / 100
              </span>
              <div className="ml-auto w-11 h-11 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <span className="text-lg font-bold text-yellow-500">C</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div className="w-28 text-[13px] text-slate-400 text-right shrink-0">
                  {cat.name}
                </div>
                <div className="flex-1 h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
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
                <div className="w-7 text-sm text-slate-400 text-right tabular-nums font-semibold">
                  {cat.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom status strip */}
        <div className="px-7 py-3.5 bg-white/[0.03] border-t border-white/[0.06] rounded-b-2xl flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-sm text-yellow-500 font-medium">
            Needs Attention
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-56px)] flex items-center px-4 gradient-hero overflow-hidden">
      <div className="absolute inset-0 pattern-grid" />

      {/* Radial glow accents */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-violet-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[400px] bg-cyan-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto max-w-6xl py-16 md:py-20">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="hero-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] mb-8">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-emerald-400">
                Free for QuickBooks users
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-[4.25rem] font-medium text-foreground tracking-tight leading-[1.08]">
              Is your business
              <br />
              <span className="italic hero-gradient-text">
                financially healthy?
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed">
              Get a 0-100 score across liquidity, receivables, revenue,
              profitability, and cash runway — delivered to your inbox in
              minutes.
            </p>

            <div className="mt-9">
              <EmailCaptureForm />
            </div>

            <div className="mt-5 flex justify-center sm:justify-start">
              <Link
                href="/health-score/example"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.08] text-sm text-slate-400 font-medium hover:text-foreground hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
              >
                <Eye className="h-4 w-4" />
                Show Me an Example
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:flex justify-center">
            <div className="w-full max-w-[440px]">
              <ScorePreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
