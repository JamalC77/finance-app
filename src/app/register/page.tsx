"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect old register route to new auth/register route
export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/register");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">Please wait</p>
      </div>
    </div>
  );
}
