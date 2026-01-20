"use client";

import Link from "next/link";
import { Check, ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Staff Accountant",
    tagline: "Clean books, on time",
    price: "$2,500",
    period: "/mo",
    features: [
      "Monthly bookkeeping & reconciliations",
      "Close-ready books",
      "Basic financial statements",
      "Payroll coordination",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Fractional Controller",
    tagline: "Close with confidence",
    price: "$4,750",
    period: "/mo",
    features: [
      "Everything in Staff Accountant",
      "Owns the month-end close",
      "Reporting pack & variance analysis",
      "Systems & controls",
      "Monthly review call",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Fractional CFO",
    tagline: "Strategic clarity",
    price: "$7,000",
    period: "/mo",
    features: [
      "Everything in Controller",
      "Cash forecasting",
      "Scenario modeling",
      "Board pack prep",
      "Strategic guidance",
      "1-2 calls per month",
    ],
    cta: "Get Started",
    highlighted: false,
  },
];

const addOns = [
  { name: "AP Processing", price: "from $750/mo" },
  { name: "AR Collections", price: "from $750/mo" },
  { name: "Multi-Entity", price: "+50% per entity" },
  { name: "Inventory Accounting", price: "Custom" },
];

const steps = [
  {
    number: "1",
    title: "Start with a Diagnostic",
    description:
      "We analyze your financials and deliver a CFO Brief with your top issues, cash analysis, and a 90-day roadmap.",
    note: "$2,500, credited toward your first month.",
  },
  {
    number: "2",
    title: "90-Day Implementation",
    description:
      "We set up systems, clean up history, and establish your reporting cadence.",
    note: null,
  },
  {
    number: "3",
    title: "Ongoing Support",
    description:
      "Month-to-month after implementation. Scale up or down as you grow.",
    note: null,
  },
];

const faqs = [
  {
    question: "What's included in the 90-day implementation?",
    answer:
      "Systems setup, historical cleanup, reporting framework, and process documentation. This is the foundation that makes ongoing support efficient.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, after the 90-day implementation period. Month-to-month after that with no long-term contracts.",
  },
  {
    question: "What if I need AP/AR management?",
    answer:
      "AP and AR processing are available as add-ons, priced based on your volume. We'll scope this during the diagnostic.",
  },
];

export function PricingContent() {
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
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-foreground font-medium transition-colors"
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
            Financial leadership
            <br />
            <span className="italic text-foreground/70">that scales with you</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Fractional finance teams for growing businesses. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "rounded-2xl border p-8 flex flex-col",
                  tier.highlighted
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/50 bg-background"
                )}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tier.tagline}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-semibold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/"
                  className={cn(
                    "w-full py-3 px-4 rounded-full text-center text-sm font-medium transition-colors",
                    tier.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground text-center mb-12">
            How it works
          </h2>

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-semibold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  {step.note && (
                    <p className="text-sm text-primary mt-2 font-medium">
                      {step.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold text-foreground text-center mb-8">
            Need more support?
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="border border-border/50 rounded-xl p-4 text-center"
              >
                <p className="font-medium text-foreground">{addon.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {addon.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We're Not */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-medium text-foreground mb-4">
            We're not your accounting department.
          </h2>
          <p className="text-muted-foreground mb-8">
            We're the strategic layer that makes your numbers work for you.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-background rounded-xl border border-border/50">
              <p className="font-medium text-foreground">Leadership, not labor</p>
              <p className="text-sm text-muted-foreground mt-2">
                Strategic guidance, not just data entry
              </p>
            </div>
            <div className="p-6 bg-background rounded-xl border border-border/50">
              <p className="font-medium text-foreground">AI-powered workflows</p>
              <p className="text-sm text-muted-foreground mt-2">
                Faster close, less manual work
              </p>
            </div>
            <div className="p-6 bg-background rounded-xl border border-border/50">
              <p className="font-medium text-foreground">One team that scales</p>
              <p className="text-sm text-muted-foreground mt-2">
                Grow from Staff to CFO as you need
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground mb-4">
            Ready to get clarity on your numbers?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start with a Diagnostic
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Schedule a Call
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            $2,500, credited toward your first month
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-foreground text-center mb-8">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-background rounded-xl border border-border/50 p-6"
              >
                <h3 className="font-medium text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
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
