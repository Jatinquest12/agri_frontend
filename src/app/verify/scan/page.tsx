"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { PageHeader } from "@/components/ui/page-header";

export default function VerifyScanPage() {
  const [token, setToken] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="QR scan flow"
        description="Browsers need HTTPS and camera permissions. Paste scanned token or open provenance link."
      />
      <Card title="Paste scanned value">
        <Input
          className="font-mono"
          placeholder="farm id or verify URL path"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        {token ? (
          <Link
            href={`/verify/p/${encodeURIComponent(token)}`}
            className="mt-3 inline-flex"
          >
            <Button>Open provenance</Button>
          </Link>
        ) : (
          <span className="mt-3 inline-block rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-300">
            Enter a token to continue
          </span>
        )}
        <p className="mt-3 text-xs text-slate-500">
          On mobile, integrate <code className="rounded bg-slate-100 px-1 dark:bg-zinc-800">getUserMedia</code>{" "}
          or a native scanner that deep-links here.
        </p>
      </Card>
      <Card title="Device camera">
        <Pill tone="warn">Camera not enabled in this build</Pill>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Ship a PWA or native wrapper for continuous QR scanning in the field.
        </p>
      </Card>
    </div>
  );
}
