"use client";

import { cn } from "@/lib/utils";

interface DemoMetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: number;
  alert?: boolean;
  highlighted?: boolean;
}

export function DemoMetricCard({ label, value, subtext, trend, alert, highlighted }: DemoMetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 relative overflow-hidden transition-all duration-300",
        alert
          ? "bg-gradient-to-br from-red-500/10 to-background border-red-500/30"
          : "bg-white/[0.02] border-white/[0.06]",
        highlighted && "border-amber-500/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]",
        "border"
      )}
    >
      <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5">
        {label}
      </div>
      <div
        className={cn(
          "text-[22px] font-semibold",
          alert ? "text-red-500" : "text-white"
        )}
      >
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-white/50 mt-1 flex items-center gap-1.5">
          {trend !== undefined && (
            <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
          {subtext}
        </div>
      )}
    </div>
  );
}
