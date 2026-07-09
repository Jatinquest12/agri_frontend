"use client";

import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { useFarmsFromApi } from "@/hooks/use-farms-from-api";

export default function FarmsListPage() {
  const { farms, loading, error, reload } = useFarmsFromApi();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farms"
        description="Register parcels, map boundaries, and attach evidence. Data is loaded from your backend registry."
        actions={
          <>
            <button
              type="button"
              className={buttonClasses({ variant: "secondary" })}
              onClick={() => void reload()}
            >
              Reload
            </button>
            <Link href="/farmer/farms/new" className={buttonClasses()}>
              Add farm (local demo)
            </Link>
          </>
        }
      />
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Could not load farms: {error}. Check <code>NEXT_PUBLIC_BACKEND_API_BASE</code> and that the API is running.
        </p>
      ) : null}
      {loading && farms.length === 0 ? (
        <p className="text-sm text-slate-500">Loading farms…</p>
      ) : null}
      {!loading && farms.length === 0 ? (
        <EmptyState
          title="No farms in registry"
          description="Use Add farm to register via POST /api/farms/register (demo: SURVEY-1001, Aadhaar 111122223333)."
        />
      ) : null}
      {farms.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {farms.map((f) => (
            <Card key={f.id} tone="subtle">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {f.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {f.cropType} · {f.areaAcres} ac
                    {f.healthScore != null ? ` · health ${f.healthScore}` : ""}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {f.center.lat.toFixed(4)}, {f.center.lng.toFixed(4)}
                  </p>
                </div>
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
              </div>
              <Link
                href={`/farmer/farms/${f.id}`}
                className="mt-4 inline-block text-sm font-semibold text-[#2E7D32] underline"
              >
                Open detail
              </Link>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
