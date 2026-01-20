"use client";

import { cn } from "@/lib/utils";

interface QuickPromptButtonsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
}

export function QuickPromptButtons({
  prompts,
  onSelect,
  disabled = false,
  className,
}: QuickPromptButtonsProps) {
  if (prompts.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className={cn(
            "px-4 py-2 text-sm rounded-full border border-border/50",
            "bg-background/50 backdrop-blur-sm",
            "text-muted-foreground hover:text-foreground",
            "hover:border-primary/50 hover:bg-primary/5",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border/50 disabled:hover:bg-background/50"
          )}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
