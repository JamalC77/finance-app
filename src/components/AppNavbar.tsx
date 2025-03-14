'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CircleUser,
  LogOut, 
  Menu, 
  Settings, 
  CreditCard, 
  Users, 
  FileText,
  BarChart,
  Home,
  DollarSign,
  Database
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = auth.user ? getNameInitials(auth.user.name) : '?';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                <SheetTitle>CFO Line</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-3">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-accent rounded-md transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/settings/integrations" 
                  className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-accent rounded-md transition-colors"
                >
                  <Database className="h-4 w-4" />
                  Integrations
                </Link>
                <Link 
                  href="/dashboard/invoices" 
                  className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-accent rounded-md transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Invoices
                </Link>
                <Link 
                  href="/dashboard/expenses" 
                  className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-accent rounded-md transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  Expenses
                </Link>
                <Link 
                  href="/dashboard/contacts" 
                  className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-accent rounded-md transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Contacts
                </Link>
                <Link 
                  href="/dashboard/reports" 
                  className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-accent rounded-md transition-colors"
                >
                  <BarChart className="h-4 w-4" />
                  Reports
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="font-bold hidden md:inline-block">CFO Line</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="ml-8 hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link 
              href="/settings/integrations" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Integrations
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
                  <AvatarImage src="" alt={auth.user?.name || 'User'} />
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
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/profile')}>
                <CircleUser className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
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