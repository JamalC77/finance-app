"use client";

import { ProspectIntelCard } from "./ProspectIntelCard";
import type { IntelCard } from "./types";

interface ProspectIntelSectionProps {
  intelCards: IntelCard[];
}

export function ProspectIntelSection({ intelCards }: ProspectIntelSectionProps) {
  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {intelCards.map((card) => (
            <ProspectIntelCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
