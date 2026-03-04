"use client";

import {
  TrendingUp,
  DollarSign,
  Activity,
  PieChart,
  Wallet,
} from "lucide-react";

const categories = [
  {
    icon: Activity,
    title: "Liquidity",
    description:
      "Can you cover your short-term obligations? We measure current and quick ratios to flag cash-flow gaps before they become emergencies.",
  },
  {
    icon: DollarSign,
    title: "Receivables",
    description:
      "How much revenue is stuck in unpaid invoices? We break down aging buckets and flag when collections are dragging down your cash.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Trend",
    description:
      "Is your top line growing, flat, or declining? We run 3- and 6-month trend analysis to spot momentum shifts early.",
  },
  {
    icon: PieChart,
    title: "Profitability",
    description:
      "Are you actually making money? We look at margins, overhead ratios, and whether profitability is trending up or eroding.",
  },
  {
    icon: Wallet,
    title: "Cash Runway",
    description:
      "How many months can you operate at current burn? We project 30/60/90-day cash positions so you can plan with confidence.",
  },
];

export function ValuePropSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground mb-4">
            What you'll learn
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your report scores your business across five categories that matter most to small business financial health.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="p-6 rounded-xl border border-border/40 bg-card/50 hover:border-border/80 hover:bg-card/80 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <cat.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {cat.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}

          {/* CTA card in the grid */}
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-primary mb-1">0–100</div>
            <div className="text-sm text-muted-foreground mb-3">
              Composite score with letter grade
            </div>
            <div className="text-xs text-muted-foreground">
              Plus a 90-day cash projection and plain-English summary delivered to your inbox
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
