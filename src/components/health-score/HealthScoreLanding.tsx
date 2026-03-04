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

      {/* Divider */}
      <div className="section-divider" />

      <ValuePropSection />

      {/* How it works (compact) */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-medium text-foreground text-center mb-10">
            Three steps. Two minutes. Zero cost.
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0">
            {[
              { num: "1", label: "Enter your email" },
              { num: "2", label: "Connect QuickBooks" },
              { num: "3", label: "Check your inbox" },
            ].map((step, i) => (
              <div key={step.num} className="flex-1 flex items-center gap-4 md:flex-col md:text-center md:gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-primary/40 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {step.num}
                </div>
                <span className="text-sm text-foreground font-medium">
                  {step.label}
                </span>
                {i < 2 && (
                  <div className="hidden md:block absolute-ignore">
                    <ArrowRight className="h-4 w-4 text-muted-foreground/30 mx-auto mt-0" />
                  </div>
                )}
              </div>
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
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Most business owners don't find out about financial problems until it's too late. Get your score now — it takes less time than making coffee.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors btn-shine"
            >
              Get My Score — Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted/30 transition-colors"
            >
              Talk to a CFO
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/40">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} The CFO Line. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
