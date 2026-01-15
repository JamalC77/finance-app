"use client";

import Link from "next/link";
import { Check, ArrowRight, DollarSign, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PricingContent() {
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
            <Link href="/auth/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="btn-shine">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Pricing Header */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 gradient-hero"></div>
          <div className="absolute inset-0 pattern-grid"></div>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-6xl text-center relative z-10">
            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Choose the Right Plan for{" "}
              <span className="gradient-text">Your Business</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Start with a 14-day free trial. No credit card required.
              Upgrade or downgrade anytime as your needs change.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Plan */}
              <Card className="flex flex-col card-hover border-gradient bg-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="feature-icon">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Basic Analytics</CardTitle>
                      <CardDescription className="text-base">Financial reports and analytics</CardDescription>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">$50</span>
                    <span className="text-muted-foreground text-lg">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Billed monthly • 14-day free trial</p>
                </CardHeader>
                <CardContent className="flex-grow relative z-10">
                  <ul className="space-y-4">
                    {[
                      "Comprehensive financial reports",
                      "In-depth business analytics",
                      "Cash flow forecasting",
                      "QuickBooks integration",
                      "Interactive data visualizations",
                      "Email support"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <Check className="h-3 w-3 text-emerald-500" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="relative z-10">
                  <Link href="/auth/register" className="w-full">
                    <Button size="lg" className="w-full h-12 text-base btn-shine">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className="flex flex-col card-hover bg-card relative overflow-hidden border-2 border-primary/30">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-emerald-500"></div>
                <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="feature-icon">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Fractional CFO</CardTitle>
                        <CardDescription className="text-base">Full-service accounting solution</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">Most Popular</Badge>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Custom Pricing</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Tailored to your business needs</p>
                </CardHeader>
                <CardContent className="flex-grow relative z-10">
                  <ul className="space-y-4">
                    {[
                      "Everything in Basic Analytics",
                      "Dedicated Fractional CFO service",
                      "Strategic financial planning",
                      "Tax optimization strategies",
                      "Business growth consulting",
                      "Financial risk management",
                      "Priority support & onboarding"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <Check className="h-3 w-3 text-emerald-500" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="relative z-10">
                  <Link href="mailto:sales@thecfoline.com" className="w-full">
                    <Button size="lg" className="w-full h-12 text-base" variant="outline">
                      Contact Sales
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">Everything you need to know about our pricing</p>
            </div>

            <div className="grid gap-6">
              {[
                {
                  q: "Can I switch between plans?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                },
                {
                  q: "Is there a free trial?",
                  a: "We offer a 14-day free trial for all new users to explore our Basic Analytics plan features. No credit card required."
                },
                {
                  q: "What's included in the Fractional CFO service?",
                  a: "Our Fractional CFO service provides you with dedicated financial expertise, strategic planning, and personalized accounting services tailored to your business needs."
                },
                {
                  q: "How secure is my financial data?",
                  a: "We use industry-standard encryption and security practices to keep your data safe. Your information is never shared with third parties without your explicit consent."
                },
                {
                  q: "Can I cancel my subscription?",
                  a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
                }
              ].map((faq, i) => (
                <Card key={i} className="card-hover bg-card border-gradient">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
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
              Ready to Transform Your Financial Management?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Start your free trial today and see why businesses trust CFO Line for their financial insights.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 h-14 btn-shine">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/eula" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                EULA
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CFO Line. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
