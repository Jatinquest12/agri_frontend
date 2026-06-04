"use client";

import { useEffect } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { brand } from "@/data/site-content";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="app-backdrop flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="surface-card w-full max-w-lg rounded-2xl p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          {brand.name}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Something went wrong
        </h1>
        <div className="mt-4">
          <Alert tone="error" title="Unexpected error">
            {error.message || "An unknown error occurred. Try again or return home."}
          </Alert>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="secondary" onClick={() => (window.location.href = "/")}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
