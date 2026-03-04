"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { EmailCaptureForm } from "./EmailCaptureForm";

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-32 px-4 gradient-hero overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 pattern-grid" />

      <div className="relative container mx-auto max-w-3xl text-center">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-medium text-foreground tracking-tight leading-tight">
          Know Your Financial
          <br />
          <span className="italic text-foreground/70">Health Score</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          Connect your QuickBooks. Get scored in minutes. Free.
        </p>

        <div className="mt-10">
          <EmailCaptureForm />
        </div>

        <div className="mt-6">
          <Link
            href="/health-score/example"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye className="h-4 w-4" />
            Show me an example
          </Link>
        </div>
      </div>
    </section>
  );
}
