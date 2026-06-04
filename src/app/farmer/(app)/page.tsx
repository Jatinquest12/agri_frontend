"use client";

import Link from "next/link";

import { Alert } from "@/components/ui/alert";
import { LinkButton } from "@/components/ui/link-button";
import { Card, Pill } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, SkeletonBlock } from "@/components/ui/states";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";
import { useFarmsFromApi } from "@/hooks/use-farms-from-api";
import { mockNotifications } from "@/lib/mock-data";

export default function FarmerHomePage() {
  const { farms, loading, error, reload } = useFarmsFromApi();

  const unread = mockNotifications.filter((n) => !n.read).length;
  const pending = farms.filter((f) => f.status === "pending_review").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Crop intelligence, proofs, and alerts in one unified workflow."
        breadcrumbs={[
          { label: "Farmer", href: "/farmer" },
          { label: "Dashboard" },
        ]}
        actions={<LinkButton href="/farmer/farms/new">Register farm</LinkButton>}
      />

      {error ? (
        <Alert
          tone="warning"
          title="Registry API unavailable"
          actions={
            <button
              type="button"
              className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-semibold hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-950"
              onClick={() => void reload()}
            >
              Retry
            </button>
          }
        >
          {error}
        </Alert>
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
            View all farms
          </Link>
        </Card>
        <Card title="Pending review">
          <p className="text-3xl font-bold text-amber-800 dark:text-amber-200">
            {loading && farms.length === 0 ? "…" : <CountUp value={pending} />}
          </p>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            awaiting admin approval
          </span>
        </Card>
        <Card title="Notifications">
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            <CountUp value={unread} />
          </p>
          <span className="text-sm text-slate-600 dark:text-slate-400">unread</span>
          <Link
            href="/farmer/notifications"
            className="mt-2 inline-block text-sm font-medium text-emerald-700 underline"
          >
            Open inbox
          </Link>
        </Card>
      </div>

      <Card title="Farm status snapshot">
        {loading && farms.length === 0 ? (
          <div className="space-y-2" aria-busy="true" aria-label="Loading farms">
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-3/4" />
          </div>
        ) : null}
        {!loading && farms.length === 0 ? (
          <EmptyState
            title="No farms yet"
            description="Register your first farm to sync with the backend registry and unlock insights and proof tooling."
            action={<LinkButton href="/farmer/farms/new">Register farm</LinkButton>}
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
        ) : null}
      </Card>
    </div>
  );
}
