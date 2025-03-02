"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <Landmark className="h-6 w-6" />
                  <span>Finance App</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={pathname === item.href}
                  />
                ))}
              </nav>
              <div className="flex flex-col space-y-1 pt-4 border-t">
                <NavItem
                  href="/help"
                  label="Help & Support"
                  icon={<HelpCircle className="h-5 w-5" />}
                  isActive={pathname === '/help'}
                />
                <NavItem
                  href="/"
                  label="Log Out"
                  icon={<LogOut className="h-5 w-5" />}
                  isActive={false}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Landmark className="h-6 w-6" />
            <span className="hidden md:inline-flex">Finance App</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:inline-flex">
            Your Business Name
          </span>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">YB</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation (desktop) */}
        <aside className="hidden w-64 flex-col border-r lg:flex">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-2 py-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">YB</span>
              </div>
              <div>
                <p className="text-sm font-medium">Your Business</p>
                <p className="text-xs text-muted-foreground">Finance Management</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1 mt-4">
              <NavItem
                href="/help"
                label="Help & Support"
                icon={<HelpCircle className="h-5 w-5" />}
                isActive={pathname === '/help'}
              />
              <NavItem
                href="/"
                label="Log Out"
                icon={<LogOut className="h-5 w-5" />}
                isActive={false}
              />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 