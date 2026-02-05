"use client";

import Link from "next/link";
import { Check, ArrowRight, Calendar, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Lite",
    tagline: "Turn the lights on",
    price: "$2,500",
    period: "/mo",
    description:
      "AI connected to your systems. See your data clearly — often for the first time.",
    features: [
      "All systems integrated into one place",
      "13-week cash flow forecast",
      "Conversational analytics — just ask it questions",
      "Anomaly detection & cash flow alerts",
      "Auto-generated dashboards",
      "Accessible anywhere — mobile, desktop, conversational",
      "Monthly 30-60 min review call",
      "24/7 support",
    ],
    cta: "Get Started",
    highlighted: false,
    ideal: "$1-5M revenue with existing staff",
  },
  {
    name: "Pro",
    tagline: "Your fractional CFO",
    price: "$6,000",
    period: "/mo",
    description:
      "Everything in Lite plus deep, ongoing strategic partnership with a dedicated CFO.",
    features: [
      "Everything in Lite",
      "13-week cash forecast + working capital management",
      "Service line / product line profitability analysis",
      "Proactive insights & recommendations",
      "Scenario modeling & strategic guidance",
      "Dedicated CFO relationship",
      "24/7 support",
    ],
    cta: "Get Started",
    highlighted: true,
    ideal: "$3-15M revenue with structural complexity",
  },
];

const expansionPackages = [
  {
    name: "Controller Package",
    trigger: "Your data reveals your books need work",
    includes: [
      "Full accounting & monthly close",
      "Final reporting",
      "Business controls & compliance",
    ],
  },
  {
    name: "Integrated Tax Package",
    trigger: "You want one team handling everything",
    includes: [
      "Business tax returns",
      "Personal returns for owners",
      "Ongoing tax planning",
      "24/7 tax support",
    ],
  },
  {
    name: "Full CFO Package",
    trigger: "You need a complete finance department",
    includes: [
      "Complete finance department outsourcing",
      "1.2x the service of internal staff at a fraction of the cost",
    ],
  },
];

const steps = [
  {
    number: "1",
    title: "Start with a Financial Diagnostic",
    description:
      "We dive deep into your financials and surface leakage, trapped capital, margin problems, and cash flow issues. The findings typically exceed the fee.",
    note: "$2,500 - $7,500 one-time. Self-funding guarantee. Credits toward onboarding if you start within 30 days.",
  },
  {
    number: "2",
    title: "Pick your tier",
    description:
      "Lite if you want AI-powered visibility into your numbers. Pro if you want a strategic CFO partner in your business.",
    note: null,
  },
  {
    number: "3",
    title: "Expand as you need",
    description:
      "Most clients discover they need more once they can finally see their data. Controller services, tax, full finance department — we grow with you.",
    note: null,
  },
];

const faqs = [
  {
    question: "What are the three answers CFO OS gives me?",
    answer:
      "13-week cash forecast and working capital management (will I make payroll?), conversational pocket analytics (ask your data anything), and service/product line profitability (which parts of my business actually make money?).",
  },
  {
    question: "What's the Financial Diagnostic?",
    answer:
      "A deep dive into your financials that surfaces leakage, trapped capital, margin problems, and cash flow issues. The findings typically exceed the fee — it's self-funding. If you decide to work with us within 30 days, the fee credits toward your onboarding.",
  },
  {
    question: "What's the difference between Lite and Pro?",
    answer:
      "Lite is the AI product — your data connected, visible, and accessible 24/7. Pro adds a dedicated fractional CFO who's actively in your business making strategic recommendations. Most Lite clients graduate to Pro once the data reveals what needs fixing.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Month-to-month after your initial onboarding period. No long-term contracts.",
  },
  {
    question: "What systems do you integrate with?",
    answer:
      "QuickBooks, bank accounts, payroll systems, and more. We build a relational data model across all your systems so everything talks to each other.",
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
            All your systems.
            <br />
            <span className="italic text-foreground/70">
              Three answers that matter.
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            We integrate every system into one place and give you the clarity to
            make decisions with confidence. 24/7 support included.
          </p>
        </div>
      </section>

      {/* The Three Answers */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted/30 rounded-xl border border-border/50 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                13-Week Cash Forecast
              </h3>
              <p className="text-sm text-muted-foreground">
                Will I make payroll? When do I need to draw on my line?
              </p>
            </div>
            <div className="p-6 bg-muted/30 rounded-xl border border-border/50 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Pocket Analytics
              </h3>
              <p className="text-sm text-muted-foreground">
                Analytics so simple you can just ask it questions.
              </p>
            </div>
            <div className="p-6 bg-muted/30 rounded-xl border border-border/50 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Line Profitability
              </h3>
              <p className="text-sm text-muted-foreground">
                Which parts of my business actually make money?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
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

                <div className="mb-4">
                  <span className="text-4xl font-semibold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  {tier.description}
                </p>

                <ul className="space-y-3 mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-muted-foreground/70 mb-4">
                  Ideal for: {tier.ideal}
                </p>

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

      {/* Expansion Packages */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-medium text-foreground text-center mb-4">
            Expand as you grow
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Once you can see your data, you&apos;ll know what needs fixing.
            We&apos;re ready when you are.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {expansionPackages.map((pkg) => (
              <div
                key={pkg.name}
                className="border border-border/50 rounded-xl p-6"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {pkg.name}
                </h3>
                <p className="text-xs text-primary mb-4 italic">
                  {pkg.trigger}
                </p>
                <ul className="space-y-2">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Flywheel */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-medium text-foreground mb-4">
            Every step is your idea, not ours.
          </h2>
          <p className="text-muted-foreground mb-8">
            The data tells you what needs fixing. We just make it easy to say
            yes.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-background rounded-xl border border-border/50">
              <p className="font-medium text-foreground">
                AI-powered visibility
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                All your systems, one place, answers on demand
              </p>
            </div>
            <div className="p-6 bg-background rounded-xl border border-border/50">
              <p className="font-medium text-foreground">
                Human judgment where it counts
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Strategic guidance backed by real financial expertise
              </p>
            </div>
            <div className="p-6 bg-background rounded-xl border border-border/50">
              <p className="font-medium text-foreground">
                One team that scales
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                From analytics to full finance department — all under one roof
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground mb-4">
            Ready to see your numbers clearly?
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
            $2,500 - $7,500 one-time. Self-funding guarantee. Credits toward
            onboarding.
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
            &copy; {new Date().getFullYear()} The CFO Line. All rights
            reserved.
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
