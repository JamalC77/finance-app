"use client";

import { Suspense } from "react";
import { CompleteScreen } from "@/components/health-score/CompleteScreen";

export default function CompletePage() {
  return (
    <Suspense>
      <CompleteScreen />
    </Suspense>
  );
}
