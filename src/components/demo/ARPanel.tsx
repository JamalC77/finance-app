"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DemoMetricCard } from "./DemoMetricCard";
import { arAging } from "./demoData";
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

interface ARPanelProps {
  highlight: HighlightType;
}

export function ARPanel({ highlight }: ARPanelProps) {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-4 gap-3 mb-6">
        <DemoMetricCard label="Total AR" value="$124K" subtext="9.5% of TTM" />
        <DemoMetricCard label="Current" value="$67K" subtext="54% of AR" />
        <DemoMetricCard
          label="Past Due"
          value="$26K"
          subtext="21% of AR"
          alert
          highlighted={highlight === "aging"}
        />
        <DemoMetricCard label="DSO" value="34 days" subtext="Industry: 28" trend={-18} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={cn(
            "bg-white/[0.02] rounded-xl p-5 transition-all duration-300 border",
            highlight === "aging"
              ? "border-amber-500/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
              : "border-white/[0.06]"
          )}
        >
          <div className="text-[13px] text-white/50 mb-4 font-medium">
            AR Aging Buckets
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={arAging} layout="vertical">
              <XAxis
                type="number"
                stroke="rgba(255,255,255,0.3)"
                fontSize={10}
                tickFormatter={formatCurrency}
              />
              <YAxis
                type="category"
                dataKey="bucket"
                stroke="rgba(255,255,255,0.3)"
                fontSize={10}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" name="Amount" radius={[0, 4, 4, 0]}>
                {arAging.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-[13px] text-white/50 mb-4 font-medium">Distribution</div>
          <div className="flex flex-col gap-3">
            {arAging.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-white/60">{item.bucket}</span>
                  <span className="text-xs" style={{ color: item.color }}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{ width: `${item.percentage}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
