"use client";

import Link from "next/link";
import { Check, Database, ArrowRight, MessageSquare, PieChart, TrendingUp, BarChart3, ContactIcon, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <DollarSign className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">CFO Line</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Pricing Header */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-5xl font-bold leading-tight mb-6">Transparent Pricing for Your Business Needs</h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Choose the plan that works best for your business. Scale up or down as your needs change.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {/* Basic Plan */}
              <Card className="flex flex-col border-">
                <CardHeader>
                  <CardTitle className="text-2xl">Basic Analytics</CardTitle>
                  <CardDescription className="text-lg">Financial reports and analytics</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$50</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Comprehensive financial reports</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>In-depth business analytics</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Cash flow forecasting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>QuickBooks integration</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Data visualizations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/auth/register" className="w-full">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Premium Plan */}
              {/* <Card className="flex flex-col border-2 border-primary">
                <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">MOST POPULAR</div>
                <CardHeader>
                  <CardTitle className="text-2xl">AI Analytics</CardTitle>
                  <CardDescription className="text-lg">Analytics with AI assistant</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$150</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Everything in Basic plan</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>AI agent to analyze your data</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Natural language queries to your data</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Advanced trend identification</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Financial anomaly detection</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Personalized financial insights</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/auth/register" className="w-full">
                    <Button size="lg" className="w-full" variant="default">
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card> */}

              {/* Enterprise Plan */}
              <Card className="flex flex-col border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Personal CFO</CardTitle>
                  <CardDescription className="text-lg">Full-service accounting solution</CardDescription>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">Custom Pricing</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Everything in AI Analytics plan</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Personal CFO service</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Strategic financial planning</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Tax optimization strategies</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Business growth consulting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Financial risk management</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="mailto:sales@thecfoline.com" className="w-full">
                    <Button size="lg" className="w-full" variant="outline">
                      Contact Sales
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I switch between plans?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">We offer a 14-day free trial for all new users to explore our Basic Analytics plan features.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">What's included in the Personal CFO service?</h3>
                <p className="text-muted-foreground">
                  Our Personal CFO service provides you with dedicated financial expertise, strategic planning, and personalized accounting services
                  tailored to your business needs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">How secure is my financial data?</h3>
                <p className="text-muted-foreground">
                  We use industry-standard encryption and security practices to keep your data safe. Your information is never shared with third
                  parties without your explicit consent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Financial Management?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Choose the plan that works for your business and start making smarter financial decisions today.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <DollarSign className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold">CFO Line</span>
            </div>
            <div className="flex space-x-6 mb-6 md:mb-0">
              <Link href="/privacy-policy" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm hover:underline">
                Terms of Service
              </Link>
              <Link href="/eula" className="text-sm hover:underline">
                EULA
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} CFO Line. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
