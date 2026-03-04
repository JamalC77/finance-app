"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { LandingHeader } from "./LandingHeader";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/thecfoline/diagnostic";

// Static demo data: "Needs Attention" rating
const DEMO = {
  companyName: "Glow Aesthetics",
  compositeScore: 54,
  letterGrade: "C",
  runwayLabel: "Needs Attention" as const,
  categories: [
    { name: "Liquidity", score: 62 },
    { name: "Receivables", score: 38 },
    { name: "Revenue Trend", score: 71 },
    { name: "Profitability", score: 45 },
    { name: "Cash Runway", score: 48 },
  ],
  summary:
    "Glow Aesthetics is generating solid revenue growth but facing mounting pressure on its cash position. The business has strong top-line momentum with a positive 3-month revenue trend, but profitability is being squeezed by overhead costs running at 78% of revenue and thinning margins over the past quarter.\n\nThe most urgent concern is receivables health. Over 32% of outstanding AR is past 61 days, and the AR-to-revenue ratio sits at 2.4 months — meaning nearly ten weeks of revenue is tied up in unpaid invoices. Combined with a cash runway of just 3.8 months at current burn, this creates a tight operating window where a single late-paying client could trigger a cash crunch.\n\nA deeper diagnostic could identify exactly which collection processes need tightening and where overhead cuts would have the biggest impact on extending your runway.",
  cashProjection: {
    currentCash: 142500,
    monthlyBurn: 37200,
    projected30d: 128900,
    projected60d: 119400,
    projected90d: 108200,
  },
};

function scoreColor(score: number): string {
  if (score > 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function scoreTextColor(score: number): string {
  if (score > 70) return "text-green-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

function formatDollars(amount: number): string {
  return `$${Math.round(amount).toLocaleString()}`;
}

export function ExampleReport() {
  const gradeColor = scoreTextColor(DEMO.compositeScore);
  const runwayColor =
    DEMO.runwayLabel === "Good"
      ? "text-green-500 border-green-500/30 bg-green-500/10"
      : DEMO.runwayLabel === "Needs Attention"
        ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
        : "text-red-500 border-red-500/30 bg-red-500/10";

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <div className="container mx-auto max-w-2xl px-4 py-12">
        {/* Banner */}
        <div className="mb-8 p-4 rounded-lg border border-primary/30 bg-primary/5 text-center">
          <p className="text-sm text-primary font-medium">
            This is an example report using sample data from a fictional company.
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Health Score
        </Link>

        {/* Report header */}
        <div className="text-center mb-2">
          <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-1">
            Financial Health Report
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-foreground">
            {DEMO.companyName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Sample Assessment</p>
        </div>

        {/* Score card */}
        <div className="mt-8 p-8 rounded-xl border border-border bg-card text-center">
          <div className={`text-6xl font-bold ${gradeColor}`}>
            {DEMO.compositeScore}
          </div>
          <div className="text-sm text-muted-foreground mt-1">out of 100</div>
          <div
            className={`mt-4 inline-block px-4 py-1.5 rounded border-2 ${
              DEMO.compositeScore >= 70
                ? "border-green-500/50"
                : DEMO.compositeScore >= 40
                  ? "border-yellow-500/50"
                  : "border-red-500/50"
            }`}
          >
            <span className={`text-xl font-bold ${gradeColor}`}>
              {DEMO.letterGrade}
            </span>
          </div>
        </div>

        {/* Runway label */}
        <div className="mt-6 p-6 rounded-xl border border-border bg-card">
          <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-3">
            Cash Runway
          </div>
          <div className={`inline-block px-3 py-1 rounded text-sm font-semibold border ${runwayColor}`}>
            {DEMO.runwayLabel}
          </div>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Your current cash trajectory suggests 2–6 months of operating runway.
            This is manageable but leaves limited margin for surprises. Tightening
            collections or trimming discretionary spend could strengthen your
            position.
          </p>
        </div>

        {/* Category breakdown */}
        <div className="mt-6 p-6 rounded-xl border border-border bg-card">
          <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-5">
            Category Breakdown
          </div>
          <div className="space-y-4">
            {DEMO.categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-4">
                <div className="w-28 text-sm text-muted-foreground flex-shrink-0">
                  {cat.name}
                </div>
                <div className="flex-1 h-5 bg-muted/30 rounded overflow-hidden">
                  <div
                    className={`h-full rounded ${scoreColor(cat.score)} transition-all`}
                    style={{ width: `${Math.max(cat.score, 2)}%` }}
                  />
                </div>
                <div className={`w-8 text-sm font-medium text-right ${scoreTextColor(cat.score)}`}>
                  {cat.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 p-6 rounded-xl border border-border bg-card">
          <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
            What This Means
          </div>
          {DEMO.summary.split("\n\n").map((p, i) => (
            <p
              key={i}
              className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0"
            >
              {p}
            </p>
          ))}
        </div>

        {/* Cash projection */}
        <div className="mt-6 p-6 rounded-xl border border-border bg-card">
          <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
            90-Day Cash Projection
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider pb-3">
                  Period
                </th>
                <th className="text-right text-xs text-muted-foreground uppercase tracking-wider pb-3">
                  Projected Cash
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Current", amount: DEMO.cashProjection.currentCash },
                { label: "30 Days", amount: DEMO.cashProjection.projected30d },
                { label: "60 Days", amount: DEMO.cashProjection.projected60d },
                { label: "90 Days", amount: DEMO.cashProjection.projected90d },
              ].map((row) => (
                <tr key={row.label} className="border-t border-border/50">
                  <td className="py-3 text-sm text-foreground">{row.label}</td>
                  <td className="py-3 text-sm text-foreground text-right">
                    {formatDollars(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground italic mt-3">
            Directional estimate based on recent trends, not a guarantee.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 p-8 rounded-xl border border-border bg-card text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Want to see your own score?
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Connect your QuickBooks and get your Financial Health Score in
            minutes. Free, no signup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors btn-shine"
            >
              Get My Score
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Talk to a CFO
            </a>
          </div>
        </div>

        {/* Privacy footer */}
        <p className="text-center text-xs text-muted-foreground mt-8 mb-4">
          Your QuickBooks data is analyzed in memory and never stored. All
          connections use bank-grade encryption.
        </p>
      </div>
    </div>
  );
}
