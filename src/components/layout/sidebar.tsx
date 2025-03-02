"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3Icon,
  FileTextIcon,
  HomeIcon,
  ReceiptIcon,
  UsersIcon,
  LucideIcon,
  Settings,
  Package2Icon,
  FileIcon,
  LayoutDashboardIcon,
} from "lucide-react";

// Navigation items for the sidebar
const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: FileTextIcon,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: ReceiptIcon,
  },
  {
    name: "Contacts",
    href: "/dashboard/contacts",
    icon: UsersIcon,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package2Icon,
  },
  {
    name: "Chart of Accounts",
    href: "/dashboard/accounts",
    icon: FileIcon,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3Icon,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

type NavItemProps = {
  href: string;
  icon: LucideIcon;
  name: string;
  isActive: boolean;
};

// Individual navigation item
const NavItem = ({ href, icon: Icon, name, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium",
        isActive
          ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{name}</span>
    </Link>
  );
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-[hsl(var(--card))]">
      <div className="px-3 py-4">
        <Link href="/dashboard" className="flex items-center gap-x-2 mb-6">
          <HomeIcon className="h-6 w-6 text-[hsl(var(--primary))]" />
          <span className="font-semibold text-xl">FinanceApp</span>
        </Link>

        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem
              key={item.name}
              {...item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-x-3">
          <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary-foreground))]">
            U
          </div>
          <div>
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
} 