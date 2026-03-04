import { DiagnosticChat } from "@/components/DiagnosticChat";

// Force server-render on every request so Netlify never serves stale HTML
export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return <DiagnosticChat />;
}
