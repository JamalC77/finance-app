"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { ArrowRight, BarChart, DollarSign, CreditCard, TrendingUp, LineChart, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect authenticated users to dashboard
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // If still loading auth state, show loading screen
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="feature-icon">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">CFO Line</h1>
          <p className="text-lg text-muted-foreground mb-8">Loading application...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show landing page
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
            <Link href="/pricing">
              <Button variant="ghost" className="hidden sm:inline-flex">Pricing</Button>
            </Link>
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
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-4 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 gradient-hero"></div>
          <div className="absolute inset-0 pattern-grid"></div>
          
          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-6xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>Powered by QuickBooks Integration</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Transform Your Financial Data Into{" "}
              <span className="gradient-text">Powerful Insights</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              CFO Line connects seamlessly with QuickBooks to process your financial data and deliver 
              deep business analytics that help you make smarter decisions and drive growth.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 h-14 btn-shine glow-primary">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="text-lg px-8 h-14">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-muted/30"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need for Financial Clarity
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to give you complete visibility into your business finances.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-hover border-gradient bg-card">
                <CardHeader>
                  <div className="feature-icon mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">QuickBooks Integration</CardTitle>
                  <CardDescription className="text-base">Seamless connection with your QuickBooks account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automatically sync your financial data from QuickBooks and keep everything up-to-date 
                    in real-time for accurate business intelligence.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover border-gradient bg-card">
                <CardHeader>
                  <div className="feature-icon mb-4">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Advanced Analytics</CardTitle>
                  <CardDescription className="text-base">Transform raw data into actionable insights.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our algorithms analyze your financial data to uncover trends, 
                    opportunities, and potential issues before they impact your business.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover border-gradient bg-card">
                <CardHeader>
                  <div className="feature-icon mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Cash Flow Forecasting</CardTitle>
                  <CardDescription className="text-base">See your financial future with clarity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Predict your cash position months ahead with intelligent forecasting that 
                    helps you plan for growth and avoid cash crunches.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover border-gradient bg-card">
                <CardHeader>
                  <div className="feature-icon mb-4">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Strategic Reports</CardTitle>
                  <CardDescription className="text-base">Make data-driven decisions with confidence.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Generate clear, digestible reports that help you understand your financial 
                    position and make strategic decisions to grow your business.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover border-gradient bg-card">
                <CardHeader>
                  <div className="feature-icon mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Expense Tracking</CardTitle>
                  <CardDescription className="text-base">Know exactly where your money goes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Categorize and track expenses automatically, identify spending patterns, 
                    and find opportunities to reduce costs and improve margins.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover border-gradient bg-card">
                <CardHeader>
                  <div className="feature-icon mb-4">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Secure Data Handling</CardTitle>
                  <CardDescription className="text-base">Your data stays protected.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your financial data is encrypted and securely handled. We never share your 
                    information with third parties without your consent.
                  </p>
                </CardContent>
              </Card>
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
              Ready to Unlock the Full Potential of Your Financial Data?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Start using CFO Line to gain deeper insights, identify growth opportunities, 
              and make smarter financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 h-14 btn-shine">
                  Create Your Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                  View Pricing Options
                </Button>
              </Link>
            </div>
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
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
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
