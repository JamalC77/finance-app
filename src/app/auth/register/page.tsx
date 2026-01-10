"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, DollarSign, ArrowLeft, Check } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const auth = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      router.push("/dashboard");
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset any previous errors
    setFormError(null);

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setFormError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      await auth.register(name, email, password);
      // The redirect will happen automatically from the useEffect above
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
    }
  };

  if (auth.isLoading || auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero"></div>
      <div className="absolute inset-0 pattern-grid"></div>
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/4"></div>

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

      <div className="flex flex-grow items-center justify-center p-4 py-12 relative z-10">
        <div className="w-full max-w-lg">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          
          <div className="grid md:grid-cols-5 gap-6">
            {/* Benefits sidebar - hidden on mobile */}
            <div className="hidden md:block md:col-span-2 space-y-4 py-8">
              <h3 className="font-semibold text-lg mb-4">Why CFO Line?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Free 14-day trial</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">No credit card required</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">QuickBooks sync in minutes</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Bank-level security</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Registration form */}
            <Card className="md:col-span-3 border-gradient bg-card/95 backdrop-blur-sm shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription className="text-base">Start your free 14-day trial</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    {(auth.error || formError) && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{formError || auth.error?.message}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="h-12"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@company.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="h-12"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="h-12"
                        placeholder="Min. 8 characters"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        className="h-12"
                      />
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                      <Checkbox 
                        id="terms" 
                        checked={agreeTerms} 
                        onCheckedChange={(checked) => setAgreeTerms(checked === true)} 
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy-policy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base btn-shine" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="text-center w-full text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    Log in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
