"use client";

import React from "react";
import Link from "next/link";
import { BellIcon, MenuIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-[hsl(var(--background))] px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <MenuIcon className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      <div className="w-full flex-1">
        <form className="hidden md:block">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full max-w-sm bg-[hsl(var(--background))] pl-8 md:w-[240px] lg:w-[440px]"
            />
          </div>
        </form>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-[hsl(var(--primary))]"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/invoices/new">
            Create Invoice
          </Link>
        </Button>
        
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/expenses/new">
            Record Expense
          </Link>
        </Button>
      </div>
    </header>
  );
} 