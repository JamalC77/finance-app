"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProspectCTAProps {
  headline: string;
  subhead: string;
  buttonText: string;
  calendarLink: string;
  onCtaClick?: () => void;
  visible?: boolean;
}

export function ProspectCTA({
  headline,
  subhead,
  buttonText,
  calendarLink,
  onCtaClick,
  visible = true,
}: ProspectCTAProps) {
  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
    }
    window.open(calendarLink, "_blank");
  };

  if (!visible) return null;

  return (
    <div className="w-full px-4 py-8 bg-gradient-to-br from-primary/5 to-background border-t border-border/40">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{headline}</h2>
        <p className="text-muted-foreground mb-6">{subhead}</p>
        <Button
          onClick={handleClick}
          size="lg"
          className="rounded-full px-8 py-6 text-lg"
        >
          <Calendar className="mr-2 h-5 w-5" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
