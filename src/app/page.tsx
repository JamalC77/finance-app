"use client";

import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2,
  Building2,
  Briefcase,
  Target,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadChatWidget } from "@/components/LeadChatWidget";

export default function LandingPage() {
  const calendlyUrl = "https://calendly.com/cfoline"; // Update with actual Calendly link

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">CFO Line</span>
          </Link>
          <div className="flex items-center space-x-2">
            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
              <Button className="btn-shine">
                <Calendar className="mr-2 h-4 w-4" />
                Book a Call
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 px-4 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 gradient-hero"></div>
          <div className="absolute inset-0 pattern-grid"></div>

          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Building2 className="h-4 w-4" />
              <span>For businesses doing $1M–$50M in revenue</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              CFO-Level Financial Leadership{" "}
              <span className="gradient-text">Without the Full-Time Cost</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              You&apos;ve outgrown QuickBooks and DIY bookkeeping. But you don&apos;t need a $200K CFO sitting in a seat 40 hours a week. You need expertise on demand—clean financials, cash flow visibility, and strategic guidance when it matters.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-8 h-14 btn-shine glow-primary">
                  Schedule a Discovery Call
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              No commitment. 30-minute call to see if we&apos;re a fit.
            </p>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-muted/30"></div>
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stuck in the Gap?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Most growing businesses hit a wall between $1M and $50M in revenue. The financial setup that got you here won&apos;t get you where you&apos;re going.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="text-destructive">✗</span> What You&apos;re Dealing With
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Financials you don&apos;t fully trust</p>
                  <p className="text-muted-foreground">No clear picture of your cash position</p>
                  <p className="text-muted-foreground">Scrambling when the bank or investors ask questions</p>
                  <p className="text-muted-foreground">Making hiring and expansion decisions on gut feel</p>
                  <p className="text-muted-foreground">Paying a full-time CFO salary you can&apos;t justify</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" /> What You Actually Need
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Clean, accurate financials every month</p>
                  <p className="text-muted-foreground">Real-time cash flow visibility</p>
                  <p className="text-muted-foreground">Someone who can talk to your bank and tax preparer</p>
                  <p className="text-muted-foreground">Strategic guidance on when to hire, expand, or pull back</p>
                  <p className="text-muted-foreground">CFO expertise without the full-time overhead</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Right-Sized Financial Leadership
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get exactly the level of support you need—from reliable bookkeeping to strategic CFO guidance—and scale up as you grow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-hover border-gradient bg-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <CardHeader>
                  <div className="feature-icon mb-4">
                    <Briefcase className="h-6 w-6 text-emerald-500" />
                  </div>
                  <CardTitle className="text-xl">Staff Accountant</CardTitle>
                  <CardDescription className="text-base">Foundation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Monthly bookkeeping & reconciliation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Clean, organized financials</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Basic financial reports</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Tax-preparer ready files</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover border-gradient bg-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                <CardHeader>
                  <div className="feature-icon mb-4">
                    <BarChart3 className="h-6 w-6 text-amber-500" />
                  </div>
                  <CardTitle className="text-xl">Controller</CardTitle>
                  <CardDescription className="text-base">Visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Everything in Staff Accountant</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Cash flow forecasting</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Budget vs. actual analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Monthly financial review calls</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover border-gradient bg-card relative overflow-hidden ring-2 ring-primary">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                <div className="absolute top-4 right-4 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                  Most Popular
                </div>
                <CardHeader>
                  <div className="feature-icon mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">CFO</CardTitle>
                  <CardDescription className="text-base">Strategy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Everything in Controller</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Strategic planning & scenario modeling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Bank & investor communications</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Hiring & expansion guidance</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-8 h-14">
                  Find Your Right Fit
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-muted/30"></div>
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for Growing Businesses
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We work with companies doing $1M–$50M in annual revenue who need financial leadership without the full-time cost.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Service Businesses</h3>
                <p className="text-sm text-muted-foreground">Agencies, consultancies, professional services</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Contractors</h3>
                <p className="text-sm text-muted-foreground">Construction, trades, specialty contractors</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">E-commerce</h3>
                <p className="text-sm text-muted-foreground">Online retailers, DTC brands, marketplaces</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Growing SMBs</h3>
                <p className="text-sm text-muted-foreground">Any business ready to scale with confidence</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero"></div>
          <div className="absolute inset-0 pattern-grid"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-3xl text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready for Financial Clarity?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Let&apos;s have a conversation. In 30 minutes, we&apos;ll understand your situation and tell you honestly if we can help.
            </p>
            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-8 h-14 btn-shine">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Discovery Call
              </Button>
            </a>
            <p className="text-sm text-muted-foreground mt-6">
              No obligation. Just a real conversation about your business.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold">CFO Line</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/eula" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CFO Line. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Lead Capture Chat Widget */}
      <LeadChatWidget />
    </div>
  );
}
