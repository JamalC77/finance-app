"use client";

import { Suspense } from "react";
import { ProcessingScreen } from "@/components/health-score/ProcessingScreen";

export default function ProcessingPage() {
  return (
    <Suspense>
      <ProcessingScreen />
    </Suspense>
  );
}
