"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt,
  BarChart3, 
  Users, 
  CreditCard,
  Landmark,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/lib/contexts/AuthContext';
import { AppNavbar } from '@/components/AppNavbar';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: '/dashboard/invoices',
    label: 'Invoices',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    href: '/dashboard/expenses',
    label: 'Expenses',
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    href: '/dashboard/contacts',
    label: 'Contacts',
    icon: <Users className="h-5 w-5" />,
  },
  {
    href: '/dashboard/accounts',
    label: 'Accounts',
    icon: <Landmark className="h-5 w-5" />,
  },
  {
    href: '/dashboard/payments',
    label: 'Payments',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

function NavItem({ href, label, icon, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        isActive ? "bg-muted font-medium text-primary" : "text-muted-foreground"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Check if authenticated
  React.useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/auth/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);
  
  // Show nothing while checking authentication
  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, don't render anything (will redirect in useEffect)
  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar />
      <main className="flex-1">
        {children}
      </main>
      <OnboardingTrigger />
    </div>
  );
} 