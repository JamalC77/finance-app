"use client";

import { ShieldCheck, Lock, Clock } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Pull, score, delete",
    description: "Your financial data is analyzed in memory and never stored.",
  },
  {
    icon: Lock,
    title: "Bank-grade encryption",
    description: "All data is transmitted over TLS. OAuth tokens are encrypted at rest.",
  },
  {
    icon: Clock,
    title: "Results in minutes",
    description: "Most scores are delivered to your inbox in under 2 minutes.",
  },
];

export function TrustBadges() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          {badges.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-3 p-4 rounded-xl"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-emerald/10 text-accent-emerald flex items-center justify-center flex-shrink-0">
                <b.icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {b.title}
                </h4>
                <p className="text-xs text-muted-foreground">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
