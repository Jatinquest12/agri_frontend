"use client";

import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";
import { useFarmsFromApi } from "@/hooks/use-farms-from-api";
import { mockNotifications } from "@/lib/mock-data";

export default function FarmerHomePage() {
  const { farms, loading, error, reload } = useFarmsFromApi();

  const unread = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Crop intelligence, proofs, and alerts in one unified workflow."
        actions={
          <Link href="/farmer/farms/new" className={buttonClasses()}>
            Add farm (local demo)
          </Link>
        }
      />
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Registry API error: {error}{" "}
          <button
            type="button"
            className="ml-1 underline"
            onClick={() => void reload()}
          >
            Retry
          </button>
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Registered farms" tone="brand">
          <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
            {loading && farms.length === 0 ? "…" : <CountUp value={farms.length} />}
          </p>
          <Link
            href="/farmer/farms"
            className="mt-2 inline-block text-sm font-medium text-emerald-700 underline"
          >
            View farms
          </Link>
        </Card>
        <Card title="Notifications">
          <p className="text-3xl font-bold text-amber-800 dark:text-amber-200">
            <CountUp value={unread} />
          </p>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            unread messages
          </span>
          <Link
            href="/farmer/notifications"
            className="mt-2 inline-block text-sm font-medium text-emerald-700 underline"
          >
            Open inbox
          </Link>
        </Card>
        <Card title="Next steps">
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
            <li>Complete pending farm review</li>
            <li>Refresh AI insights after new images</li>
            <li>Download your latest certificate</li>
          </ul>
        </Card>
      </div>
      <Card title="Farm status snapshot">
        {!loading && farms.length === 0 ? (
          <EmptyState
            title="No farms yet"
            description="Register a farm via POST /api/farms/register so it appears here from the backend."
          />
        ) : null}
        {farms.length > 0 ? (
          <DataTable className="min-w-[520px]">
            <thead>
              <HeadRow>
                <TH>Farm</TH>
                <TH>Crop</TH>
                <TH>Health</TH>
                <TH className="pr-0">Status</TH>
              </HeadRow>
            </thead>
            <tbody>
              {farms.map((f) => (
                <BodyRow key={f.id}>
                  <TD className="font-medium text-slate-900 dark:text-slate-100">
                    <Link className="hover:underline" href={`/farmer/farms/${f.id}`}>
                      {f.name}
                    </Link>
                  </TD>
                  <TD>{f.cropType}</TD>
                  <TD>{f.healthScore ?? "—"}</TD>
                  <TD className="pr-0">
                    <Pill
                      tone={
                        f.status === "approved"
                          ? "ok"
                          : f.status === "rejected"
                            ? "bad"
                            : "warn"
                      }
                    >
                      {f.status.replace("_", " ")}
                    </Pill>
                  </TD>
                </BodyRow>
              ))}
            </tbody>
          </DataTable>
        ) : loading ? (
          <p className="text-sm text-slate-500">Loading farms…</p>
        ) : null}
      </Card>
    </div>
  );
}
