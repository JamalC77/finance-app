"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUser, LogOut, Menu, Settings, CreditCard, Users, FileText, BarChart, Home, DollarSign, Database, Zap, Bot } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppNavbar() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    auth.logout();
  };

  // If not authenticated, don't render the navbar
  if (!auth.isAuthenticated) {
    return null;
  }

  const getNameInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = auth.user ? getNameInitials(auth.user.name) : "?";

  // Create Stripe URL with user ID for tracking
  const stripeCheckoutUrl = `https://buy.stripe.com/test_eVaaGP830d5g4uI144?client_reference_id=${auth.user?.id}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b glass">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader className="border-b pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <SheetTitle>CFO Line</SheetTitle>
                </div>
              </SheetHeader>
              <nav className="flex flex-col space-y-1">
                <Link href="/dashboard" className="flex items-center gap-3 text-sm px-3 py-2.5 hover:bg-accent rounded-lg transition-colors">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/ai-cfo"
                  className="flex items-center gap-3 text-sm px-3 py-2.5 hover:bg-accent rounded-lg transition-colors"
                >
                  <Bot className="h-4 w-4 text-violet-500" />
                  AI CFO
                </Link>
                <Link
                  href="/settings/integrations"
                  className="flex items-center gap-3 text-sm px-3 py-2.5 hover:bg-accent rounded-lg transition-colors"
                >
                  <Database className="h-4 w-4 text-muted-foreground" />
                  Integrations
                </Link>
                <Link
                  href={stripeCheckoutUrl}
                  className="flex items-center gap-3 text-sm px-3 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Activate Plan
                </Link>
                <Link href="/dashboard/invoices" className="flex items-center gap-3 text-sm px-3 py-2.5 hover:bg-accent rounded-lg transition-colors">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Invoices
                </Link>
                <Link href="/dashboard/expenses" className="flex items-center gap-3 text-sm px-3 py-2.5 hover:bg-accent rounded-lg transition-colors">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Expenses
                </Link>
                <Link href="/dashboard/contacts" className="flex items-center gap-3 text-sm px-3 py-2.5 hover:bg-accent rounded-lg transition-colors">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Contacts
                </Link>
                <Link href="/dashboard/reports" className="flex items-center gap-3 text-sm px-3 py-2.5 hover:bg-accent rounded-lg transition-colors">
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                  Reports
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold hidden md:inline-block">CFO Line</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="ml-8 hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/ai-cfo" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-violet-500" />
              AI CFO
            </Link>
            <Link href="/settings/integrations" className="text-sm font-medium transition-colors hover:text-primary">
              Integrations
            </Link>
            <Link href={stripeCheckoutUrl}>
              <Button size="sm" className="text-sm gap-1">
                <Zap className="h-4 w-4" />
                Activate Plan
              </Button>
            </Link>
          </nav>
        </div>

        {/* User menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <Avatar>
                  <AvatarImage src="" alt={auth.user?.name || "User"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {auth.user?.name}
                <p className="text-xs text-muted-foreground">{auth.user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/profile")}>
                <CircleUser className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
