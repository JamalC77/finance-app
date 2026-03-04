import { HealthScoreLanding } from "@/components/health-score/HealthScoreLanding";

// Force server-render on every request so Netlify never serves stale HTML
export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return <HealthScoreLanding />;
}
