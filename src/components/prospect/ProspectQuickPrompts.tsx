"use client";

interface ProspectQuickPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
  disabled?: boolean;
}

export function ProspectQuickPrompts({
  prompts,
  onPromptClick,
  disabled,
}: ProspectQuickPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {prompts.slice(0, 4).map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          disabled={disabled}
          className="px-3 py-1.5 text-sm bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-border/50 hover:border-border"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
