"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { API_CONFIG } from "@/lib/config";

export function EmailCaptureForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/public/health-score/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }

      const data = await res.json();

      // Store prospectId for the return trip from QB OAuth
      localStorage.setItem("cfoline_health_score_id", data.prospectId);

      // Redirect to QuickBooks OAuth
      window.location.href = data.authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-lg border border-border/60 bg-background/80 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap btn-shine"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              Get My Score
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground/60">
        Connects to QuickBooks (read-only). Free, no signup required.
      </p>
    </form>
  );
}
