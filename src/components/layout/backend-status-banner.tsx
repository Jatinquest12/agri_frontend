"use client";

import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { getApiBase } from "@/lib/api";
import { pingApiReachable } from "@/lib/api-health";

export function BackendStatusBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const ok = await pingApiReachable();
      if (!cancelled) setOffline(!ok);
    }
    void check();
    const id = window.setInterval(() => void check(), 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (!offline) return null;

  return (
    <Alert tone="warning" title="Backend unreachable">
      Could not reach the API at{" "}
      <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs dark:bg-amber-950/60">
        {getApiBase()}
      </code>
      . Start the Agritrust backend or update{" "}
      <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs dark:bg-amber-950/60">
        NEXT_PUBLIC_BACKEND_API_BASE
      </code>{" "}
      in <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs dark:bg-amber-950/60">.env.local</code>.
    </Alert>
  );
}
