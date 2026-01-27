"use client";

import { cn } from "@/lib/utils";
import {
  CreditCard,
  Users,
  AlertCircle,
  Award,
  FileText,
  Building2,
  TrendingUp,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import type { IntelCard } from "./types";

interface ProspectIntelCardProps extends IntelCard {}

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
  CreditCard,
  Users,
  AlertCircle,
  Award,
  FileText,
  Building2,
  TrendingUp,
  DollarSign,
};

// Dynamic icon component
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = iconMap[name] || FileText;
  return <IconComponent className={className} />;
}

export function ProspectIntelCard({ icon, title, content, alert }: ProspectIntelCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 relative overflow-hidden transition-all duration-300 border h-full",
        alert
          ? "bg-amber-500/5 border-amber-500/40"
          : "bg-white/[0.03] border-white/[0.08]",
        "hover:border-primary/40 hover:bg-white/[0.05]"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-2.5 rounded-lg shrink-0",
            alert ? "bg-amber-500/20" : "bg-primary/10"
          )}
        >
          <DynamicIcon
            name={icon}
            className={cn("h-5 w-5", alert ? "text-amber-400" : "text-primary")}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "text-sm font-semibold leading-tight",
              alert ? "text-amber-400" : "text-foreground"
            )}
          >
            {title}
          </div>
          <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{content}</div>
        </div>
      </div>
    </div>
  );
}
