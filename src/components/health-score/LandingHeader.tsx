"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            THE CFO LINE
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <Link
          href="/chat"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Talk to a CFO</span>
          <Calendar className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
