"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoMetricCard } from "./DemoMetricCard";
import { monthlyPnL, serviceBreakdown } from "./demoData";
import { cn } from "@/lib/utils";
import type { HighlightType } from "./demoData";

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border border-white/10 rounded-lg px-4 py-3 text-[13px]">
        <div className="text-white/60 mb-2">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ color: entry.color }} className="mb-1">
            {entry.name}: {formatCurrency(entry.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface PnLPanelProps {
  highlight: HighlightType;
}

export function PnLPanel({ highlight }: PnLPanelProps) {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-4 gap-3 mb-6">
        <DemoMetricCard
          label="TTM Revenue"
          value="$3.88M"
          subtext="vs $3.2M prior"
          trend={21}
          highlighted={highlight === "metrics"}
        />
        <DemoMetricCard
          label="Gross Margin"
          value="78.4%"
          subtext="Target: 80%"
          trend={-2}
          highlighted={highlight === "metrics" || highlight === "margin"}
        />
        <DemoMetricCard
          label="Net Margin"
          value="24.8%"
          subtext="vs 22% industry"
          trend={8}
          highlighted={highlight === "metrics" || highlight === "margin"}
        />
        <DemoMetricCard
          label="YoY Growth"
          value="+21%"
          subtext="Accelerating"
          trend={5}
          highlighted={highlight === "metrics"}
        />
      </div>

      <div
        className={cn(
          "bg-white/[0.02] rounded-xl p-5 transition-all duration-300 border",
          highlight === "services" ? "border-amber-500/40" : "border-white/[0.06]"
        )}
      >
        <div className="text-[13px] text-white/50 mb-4 font-medium">
          Revenue & Margin Trend
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={monthlyPnL}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              fill="rgba(212, 175, 55, 0.1)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#d4af37"
              strokeWidth={2}
              dot={false}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="netIncome"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Net Income"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {highlight === "services" && (
        <div className="mt-4 bg-white/[0.02] border border-amber-500/40 rounded-xl p-5 shadow-[0_0_30px_rgba(212,175,55,0.1)] animate-in fade-in duration-300">
          <div className="text-[13px] text-white/50 mb-4 font-medium">
            Revenue by Service Line
          </div>
          <div className="flex gap-4">
            {serviceBreakdown.map((item, i) => (
              <div key={i} className="flex-1">
                <div className="text-xs text-white/50 mb-1.5">{item.service}</div>
                <div className="text-base font-semibold text-white">{formatCurrency(item.revenue)}</div>
                <div className="text-[11px] text-green-500 mt-0.5">{item.margin}% margin</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
