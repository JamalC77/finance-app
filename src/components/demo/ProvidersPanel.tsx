"use client";

import { DemoMetricCard } from "./DemoMetricCard";
import { providerMetrics } from "./demoData";
import { cn } from "@/lib/utils";
import type { HighlightType } from "./demoData";

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

interface ProvidersPanelProps {
  highlight: HighlightType;
}

export function ProvidersPanel({ highlight }: ProvidersPanelProps) {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-4 gap-3 mb-6">
        <DemoMetricCard label="Provider Revenue" value="$500K" subtext="June" />
        <DemoMetricCard
          label="Avg Utilization"
          value="73%"
          subtext="Target: 85%"
          alert
          highlighted={highlight === "utilization"}
        />
        <DemoMetricCard label="Rev per Hour" value="$187" subtext="vs $165 industry" trend={13} />
        <DemoMetricCard label="Top Performer" value="Jessica M." subtext="92% util" />
      </div>

      <div
        className={cn(
          "bg-white/[0.02] rounded-xl p-5 transition-all duration-300 border",
          highlight
            ? "border-amber-500/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
            : "border-white/[0.06]"
        )}
      >
        <div className="text-[13px] text-white/50 mb-4 font-medium">
          Provider Performance
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">
                Provider
              </th>
              <th className="text-right px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">
                Revenue
              </th>
              <th className="text-right px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">
                Sessions
              </th>
              <th className="text-right px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">
                Utilization
              </th>
              <th className="text-right px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">
                Margin
              </th>
            </tr>
          </thead>
          <tbody>
            {providerMetrics.map((provider, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-white/[0.04]",
                  highlight === "drpark" && provider.name === "Dr. Michael Park" && "bg-amber-500/10"
                )}
              >
                <td className="px-3 py-3 text-[13px] text-white font-medium">
                  {provider.name}
                  <div className="text-[11px] text-white/40 mt-0.5">{provider.role}</div>
                </td>
                <td className="px-3 py-3 text-[13px] text-white text-right">
                  {formatCurrency(provider.revenue)}
                </td>
                <td className="px-3 py-3 text-[13px] text-white/60 text-right">
                  {provider.sessions}
                </td>
                <td className="px-3 py-3 text-right">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-lg",
                      provider.utilization >= 80
                        ? "bg-green-500/15 text-green-500"
                        : provider.utilization >= 65
                        ? "bg-yellow-500/15 text-yellow-500"
                        : "bg-red-500/15 text-red-500"
                    )}
                  >
                    {provider.utilization}%
                  </span>
                </td>
                <td className="px-3 py-3 text-[13px] text-green-500 text-right">
                  {provider.margin}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
