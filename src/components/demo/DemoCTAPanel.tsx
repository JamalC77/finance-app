"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface DemoCTAPanelProps {
  sessionId?: string;
  calendlyUrl?: string;
}

export function DemoCTAPanel({ sessionId, calendlyUrl }: DemoCTAPanelProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);

    try {
      // Capture lead info
      if (sessionId) {
        await fetch(`${API_BASE}/api/public/chat/capture-lead`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, email }),
        });
      }

      setSubmitted(true);

      // Open Calendly in new tab
      if (calendlyUrl) {
        window.open(calendlyUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Failed to capture lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="animate-in fade-in duration-500 p-8 bg-gradient-to-br from-amber-500/[0.08] to-background border border-amber-500/20 rounded-2xl text-center">
        <div className="text-xl font-semibold text-white mb-2">
          We'll be in touch soon
        </div>
        <div className="text-sm text-white/50">
          Check your inbox for next steps, or{" "}
          <a
            href={calendlyUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            book a call directly
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 p-8 bg-gradient-to-br from-amber-500/[0.08] to-background border border-amber-500/20 rounded-2xl text-center">
      <div className="text-xl font-semibold text-white mb-2">
        Ready to see your numbers this clearly?
      </div>
      <div className="text-sm text-white/50 mb-6 max-w-[440px] mx-auto">
        Our Financial Diagnostic builds this view from your actuals in 5-7 business days.
      </div>
      <div className="flex gap-3 justify-center max-w-[400px] mx-auto">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !email}
          className="bg-amber-500 text-black px-6 py-3.5 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "..." : "Book a Call"}
        </button>
      </div>
    </div>
  );
}
