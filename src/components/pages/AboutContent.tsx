"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Users, Zap, Target, BookOpen, TrendingUp, PieChart, FileText } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Clarity over complexity",
    description:
      "We cut through the noise to give you the numbers that matter. No jargon, no fluff—just the insights you need to make decisions.",
  },
  {
    icon: Users,
    title: "Partnership, not vendor",
    description:
      "We're an extension of your team. We care about your success because our success depends on it.",
  },
  {
    icon: Zap,
    title: "Modern tools, human judgment",
    description:
      "We leverage AI and automation to work faster, but every insight is reviewed by experienced finance professionals.",
  },
];

const differentiators = [
  {
    title: "Not an accounting firm",
    description:
      "We don't do tax prep or audits. We focus entirely on giving you financial clarity and strategic guidance.",
  },
  {
    title: "Not a bookkeeping service",
    description:
      "We go beyond data entry. We own your close, analyze your numbers, and tell you what they mean.",
  },
  {
    title: "Not just software",
    description:
      "Tools are only as good as the people using them. You get experienced finance professionals, not just a dashboard.",
  },
];

const services = [
  {
    icon: BookOpen,
    title: "Monthly Close & Reporting",
    description:
      "Fast, accurate month-end closes with clear financial statements. Know where you stand within days, not weeks.",
  },
  {
    icon: TrendingUp,
    title: "Cash Flow Management",
    description:
      "13-week cash forecasts, AR/AP optimization, and runway planning. Never be surprised by a cash crunch again.",
  },
  {
    icon: PieChart,
    title: "Financial Analysis",
    description:
      "Unit economics, margin analysis, and profitability by customer/product. Understand what's actually driving your numbers.",
  },
  {
    icon: FileText,
    title: "Strategic Planning",
    description:
      "Budgets, forecasts, and scenario modeling. Make confident decisions about hiring, spending, and growth.",
  },
];

export function AboutContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              THE CFO LINE
            </Link>
            <nav className="hidden sm:flex items-center gap-4">
              <Link
                href="/about"
                className="text-sm text-foreground font-medium transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Talk to us</span>
            <Calendar className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-medium text-foreground tracking-tight leading-tight">
            Finance leadership
            <br />
            <span className="italic text-foreground/70">without the full-time cost</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're a team of finance professionals who believe growing businesses
            deserve strategic financial guidance—not just someone to process transactions.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground text-center mb-8">
            Why we exist
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p>
              Most businesses between $5M and $50M in revenue face the same challenge:
              they've outgrown their bookkeeper but can't justify a full-time CFO.
            </p>
            <p>
              The result? Founders making million-dollar decisions with incomplete
              information. Cash flow surprises. Missed opportunities hiding in the numbers.
            </p>
            <p>
              We built The CFO Line to fill that gap. We bring the financial expertise
              you need—from clean books to strategic forecasting—at a fraction of the
              cost of a full-time hire.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground text-center mb-4">
            What we do
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From day-to-day financial operations to strategic guidance, we handle
            the finance function so you can focus on running your business.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-6 bg-muted/30 rounded-xl border border-border/30 hover:border-border/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              See our pricing tiers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground text-center mb-12">
            How we work
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We're Not */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground text-center mb-12">
            What we're not
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="p-6 bg-background rounded-xl border border-border/50"
              >
                <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground mb-4">
            Ready to get clarity on your numbers?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start with a diagnostic. We'll analyze your financials and show you
            exactly where the opportunities are.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start with a Diagnostic
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/40">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} The CFO Line. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
