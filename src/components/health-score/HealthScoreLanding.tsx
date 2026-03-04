"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingHeader } from "./LandingHeader";
import { HeroSection } from "./HeroSection";
import { ValuePropSection } from "./ValuePropSection";

export function HealthScoreLanding() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <HeroSection />
      <ValuePropSection />

      {/* How it works */}
      <section className="py-16 px-4 border-t border-border/20">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-medium text-foreground text-center mb-10">
            Three steps. Two minutes. Zero cost.
          </h2>
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start max-w-lg mx-auto">
            {[
              { num: "1", label: "Enter your email" },
              { num: "2", label: "Connect QuickBooks" },
              { num: "3", label: "Get your report" },
            ].map((step, i) => (
              <>
                <div key={step.num} className="flex flex-col items-center gap-2.5">
                  <div className="w-11 h-11 rounded-full border-2 border-primary/30 text-primary flex items-center justify-center text-sm font-bold bg-primary/5">
                    {step.num}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium text-center">
                    {step.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className="flex items-center h-11 px-2">
                    <div className="w-12 h-px bg-primary/20" />
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground mb-4">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">
            Most business owners don&apos;t find out about financial problems
            until it&apos;s too late. Get your score now — it takes less time
            than making coffee.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors btn-shine"
            >
              Get My Score — Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border/50 text-sm text-muted-foreground font-medium hover:text-foreground hover:border-border hover:bg-muted/20 transition-all"
            >
              Talk to a CFO
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/20">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} The CFO Line
          </p>
          <div className="flex gap-5">
            <Link
              href="/about"
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy-policy"
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
