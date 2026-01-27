"use client";

import Link from "next/link";
import { DollarSign } from "lucide-react";

interface ProspectHeaderProps {
  ownerName: string;
  companyName: string;
  location?: string;
  industry?: string;
}

export function ProspectHeader({
  ownerName,
  companyName,
  location,
  industry,
}: ProspectHeaderProps) {
  return (
    <header className="w-full">
      {/* Top nav bar */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">CFO Line</span>
          </Link>
        </div>
      </div>

      {/* Hero section */}
      <div className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-hero"></div>
        <div className="absolute inset-0 pattern-grid"></div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <p className="text-muted-foreground mb-4">
            {location && <span>{location}</span>}
            {location && industry && <span className="mx-2">·</span>}
            {industry && <span>{industry}</span>}
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            <span className="text-muted-foreground font-normal">
              {ownerName ? `${ownerName}, we` : "We"} looked into
            </span>
            <br />
            <span className="gradient-text">{companyName}.</span>
          </h1>

          <p className="text-xl text-muted-foreground italic">
            Here&apos;s what stood out.
          </p>
        </div>
      </div>
    </header>
  );
}
