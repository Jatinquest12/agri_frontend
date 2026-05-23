"use client";

import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { PageHeader } from "@/components/ui/page-header";
import {
  mockAiJobs,
  mockPendingFarmers,
  mockPendingFarms,
} from "@/lib/mock-data";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations overview"
        description="Approvals, AI jobs, and verification posture at a glance."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Pending farmers" tone="brand">
          <p className="text-3xl font-bold">
            <CountUp value={mockPendingFarmers.filter((f) => f.status === "pending").length} />
          </p>
          <Link href="/admin/farmers" className="mt-2 inline-block text-sm underline">
            Review queue
          </Link>
        </Card>
        <Card title="Pending farms">
          <p className="text-3xl font-bold">
            <CountUp value={mockPendingFarms.filter((f) => f.status === "pending").length} />
          </p>
          <Link href="/admin/farms" className="mt-2 inline-block text-sm underline">
            Approve farms
          </Link>
        </Card>
        <Card title="AI jobs needing attention">
          <p className="text-3xl font-bold">
            <CountUp value={mockAiJobs.filter((j) => j.status !== "ok").length} />
          </p>
          <Link href="/admin/ai" className="mt-2 inline-block text-sm underline">
            Open monitor
          </Link>
        </Card>
      </div>
      <Card
        title="Latest AI jobs"
        actions={
          <Link
            href="/admin/ai"
            className={buttonClasses({ size: "sm", variant: "secondary" })}
          >
            Open AI monitor
          </Link>
        }
      >
        <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
          {mockAiJobs.map((j) => (
            <li key={j.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <span>
                <strong>{j.type}</strong> · farm {j.farmId}
              </span>
              <Pill tone={j.status === "ok" ? "ok" : j.status === "failed" ? "bad" : "warn"}>
                {j.status}
              </Pill>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
