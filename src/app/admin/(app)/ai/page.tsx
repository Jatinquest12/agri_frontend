"use client";

import { Card, Pill } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";
import { mockAiJobs } from "@/lib/mock-data";
import { useAuth } from "@/context/auth-context";

export default function AdminAiPage() {
  const { user } = useAuth();
  const reviewQueue = mockAiJobs.filter((j) => j.status === "review" || j.status === "failed");

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI monitoring"
        description="Proof generation telemetry, failed jobs, and confidence review."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Proof generation">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Proof batches processed in the last 24 hours.
          </p>
          <p className="mt-2 text-2xl font-bold">
            <CountUp value={128} />
          </p>
        </Card>
        <Card title="Failed AI jobs">
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            <CountUp value={mockAiJobs.filter((j) => j.status === "failed").length} />
          </p>
          <p className="mt-1 text-xs text-slate-500">Open rows below</p>
        </Card>
        <Card title="Low confidence">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-200">
            <CountUp value={mockAiJobs.filter((j) => (j.confidence ?? 1) < 0.65).length} />
          </p>
          <p className="mt-1 text-xs text-slate-500">Needs agronomist eyes</p>
        </Card>
      </div>
      <Card title="Job monitor">
        <DataTable className="min-w-[680px]">
          <thead>
            <HeadRow>
              <TH>Job</TH>
              <TH>Farm</TH>
              <TH>Status</TH>
              <TH>Confidence</TH>
              <TH className="pr-0">Updated</TH>
            </HeadRow>
          </thead>
          <tbody>
            {mockAiJobs.map((j) => (
              <BodyRow key={j.id}>
                <TD className="font-mono text-xs">{j.id}</TD>
                <TD>{j.farmId}</TD>
                <TD>
                  <Pill tone={j.status === "ok" ? "ok" : j.status === "failed" ? "bad" : "warn"}>
                    {j.status}
                  </Pill>
                </TD>
                <TD>{j.confidence?.toFixed(2) ?? "—"}</TD>
                <TD className="pr-0 text-xs text-slate-500 dark:text-slate-400">
                  {new Date(j.updatedAt).toLocaleString()}
                </TD>
              </BodyRow>
            ))}
          </tbody>
        </DataTable>
      </Card>
      <Card
        title="Manual agronomist review"
        subtitle={
          user?.role === "agronomist"
            ? "Signed in as agronomist — triage low-confidence outputs."
            : "Sign in with agronomist OTP to focus this queue."
        }
      >
        {reviewQueue.length === 0 ? (
          <EmptyState
            title="Queue is clear"
            description="No failed or low-confidence jobs currently need manual review."
          />
        ) : (
          <ul className="space-y-2">
            {reviewQueue.map((j) => (
              <li
                key={j.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 text-sm dark:border-zinc-800"
              >
                <span>
                  {j.type} · {j.farmId}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={user?.role !== "agronomist" && user?.role !== "admin"}
                >
                  Mark reviewed
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
