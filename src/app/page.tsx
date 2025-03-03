import Link from "next/link";
import { Landmark, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApiConnectionTestWrapper from "@/components/ApiConnectionTestWrapper";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Landmark className="h-6 w-6" />
          <span>Finance App</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <Link href="/dashboard">
            <Button>
              Log In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6 md:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Financial Management Made Simple
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Manage your business finances all in one place. Track expenses, create invoices, monitor cash flow, and more.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* API Connection Test Section */}
        <section className="py-10 bg-background">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                API Connection Status
              </h2>
              <p className="mt-2 text-muted-foreground">
                Verifying connection to the backend services
              </p>
            </div>
            <ApiConnectionTestWrapper />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything You Need for Financial Success
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Our comprehensive platform includes all the tools you need to manage your business finances efficiently.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Invoicing",
                  description: "Create professional invoices and track payments with ease.",
                },
                {
                  title: "Expense Management",
                  description: "Keep track of all your business expenses in one place.",
                },
                {
                  title: "Financial Reporting",
                  description: "Generate detailed reports to gain insights into your finances.",
                },
                {
                  title: "Accounts & Banking",
                  description: "Connect your bank accounts for automated transaction tracking.",
                },
                {
                  title: "Contact Management",
                  description: "Maintain records of all your customers and vendors.",
                },
                {
                  title: "Chart of Accounts",
                  description: "Organize your finances with a customizable chart of accounts.",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link href="/dashboard">
                <Button size="lg">
                  Try It Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Landmark className="h-6 w-6" />
              <span className="font-semibold">Finance App</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Finance App. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
