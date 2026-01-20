"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Cell,
} from "recharts";
import { DemoMetricCard } from "./DemoMetricCard";
import { cashFlow } from "./demoData";
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

interface CashFlowPanelProps {
  highlight: HighlightType;
}

export function CashFlowPanel({ highlight }: CashFlowPanelProps) {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-4 gap-3 mb-6">
        <DemoMetricCard label="Cash Balance" value="$309K" subtext="vs $145K Jul" trend={113} />
        <DemoMetricCard
          label="Cash Conversion"
          value="47 days"
          subtext="Target: 35"
          alert
          highlighted={highlight === "conversion"}
        />
        <DemoMetricCard label="Operating Cash" value="$98K" subtext="June" trend={12} />
        <DemoMetricCard label="Runway" value="4.2 mo" subtext="at current burn" />
      </div>

      <div
        className={cn(
          "bg-white/[0.02] rounded-xl p-5 transition-all duration-300",
          highlight === "janfeb"
            ? "border border-amber-500/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
            : "border border-white/[0.06]"
        )}
      >
        <div className="text-[13px] text-white/50 mb-4 font-medium">
          Cash Position & Net Cash Flow
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={cashFlow}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              fill="rgba(34, 197, 94, 0.1)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Cash Balance"
            />
            <Bar dataKey="netCash" name="Net Cash Flow" radius={[3, 3, 0, 0]}>
              {cashFlow.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.netCash >= 0 ? "rgba(34, 197, 94, 0.6)" : "rgba(239, 68, 68, 0.6)"}
                  stroke={
                    highlight === "janfeb" && (entry.month === "Jan" || entry.month === "Feb")
                      ? "#d4af37"
                      : "none"
                  }
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        {highlight === "janfeb" && (
          <div className="mt-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-500 flex items-center gap-2">
            <span>→</span> Jan-Feb shows negative cash flow despite profitable operations
          </div>
        )}
      </div>
    </div>
  );
}
