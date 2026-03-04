"use client";

import { Link2, BarChart3, Mail } from "lucide-react";

const steps = [
  {
    icon: Link2,
    step: "1",
    title: "Connect",
    description:
      "Securely link your QuickBooks account with one click. Read-only access — we never modify your data.",
  },
  {
    icon: BarChart3,
    step: "2",
    title: "Analyze",
    description:
      "We pull 12 months of financial data and score your business across 5 key categories.",
  },
  {
    icon: Mail,
    step: "3",
    title: "Score",
    description:
      "Your Financial Health Score report arrives in your inbox within minutes. Actionable, no jargon.",
  },
];

export function ValuePropSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground text-center mb-4">
          How it works
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Three steps. Under two minutes. Zero cost.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase mb-2">
                Step {s.step}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
