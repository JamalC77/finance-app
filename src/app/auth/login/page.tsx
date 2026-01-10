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
import { AlertCircle, DollarSign, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    if (!email || !password) {
      return;
    }

    setIsLoading(true);

    try {
      await auth.login(email, password);
      // The redirect will happen automatically from the useEffect above
    } catch (error) {
      console.error("Login error:", error);
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

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

      <div className="flex flex-grow items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          
          <Card className="border-gradient bg-card/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription className="text-base">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  {auth.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{auth.error.message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="h-12"
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="h-12"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base btn-shine" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    New to CFO Line?
                  </span>
                </div>
              </div>
              <Link href="/auth/register" className="w-full">
                <Button variant="outline" className="w-full h-12">
                  Create an account
                </Button>
              </Link>
              <div className="text-center text-xs text-muted-foreground">
                By logging in, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
