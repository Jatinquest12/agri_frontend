"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonClasses } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { fetchFarmById } from "@/lib/farms-api";
import type { Farm } from "@/types/platform";

export default function FarmDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const row = await fetchFarmById(id);
      if (cancelled) return;
      setFarm(row);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Farm" description="Loading from registry…" />
        <p className="text-sm text-slate-500">Fetching GET /api/farms/{id}…</p>
      </div>
    );
  }

  if (!farm) {
    return (
      <EmptyState
        title="Farm not found"
        description="This farm id is missing from the backend registry. Use /api/farms/register or choose another parcel from your list."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={farm.name}
        description={`${farm.cropType} · ${farm.areaAcres} acres`}
        actions={
          <Pill tone={farm.status === "approved" ? "ok" : "warn"}>
            {farm.status.replace("_", " ")}
          </Pill>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Location">
          <p className="text-sm">
            Center:{" "}
            <span className="font-mono">
              {farm.center.lat}, {farm.center.lng}
            </span>
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Boundary vertices: {farm.boundary.length}
          </p>
          <ul className="mt-2 max-h-40 overflow-auto font-mono text-xs text-slate-700 dark:text-slate-300">
            {farm.boundary.map((p, i) => (
              <li key={`${p.lat}-${p.lng}-${i}`}>
                {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Documents & imagery">
          <p className="text-sm font-medium">Land documents</p>
          <ul className="list-inside list-disc text-sm text-slate-600">
            {farm.landDocNames.length ? (
              farm.landDocNames.map((n) => <li key={n}>{n}</li>)
            ) : (
              <li>None uploaded</li>
            )}
          </ul>
          <p className="mt-3 text-sm font-medium">Crop images</p>
          <ul className="list-inside list-disc text-sm text-slate-600">
            {farm.cropImageNames.length ? (
              farm.cropImageNames.map((n) => <li key={n}>{n}</li>)
            ) : (
              <li>None uploaded</li>
            )}
          </ul>
        </Card>
      </div>
      <Card title="Quick actions">
        <div className="flex flex-wrap gap-2">
          <Link href="/farmer/insights" className={buttonClasses({ size: "sm" })}>
            AI insights
          </Link>
          <Link
            href="/farmer/proof"
            className={buttonClasses({ variant: "secondary", size: "sm" })}
          >
            Proof & certificate
          </Link>
          <Link
            href={`/verify/p/${farm.id}`}
            className={buttonClasses({ variant: "secondary", size: "sm" })}
          >
            Public verify link
          </Link>
          <Link
            href="/farmer/farms"
            className={buttonClasses({ variant: "ghost", size: "sm" })}
          >
            Back to farms
          </Link>
        </div>
      </Card>
    </div>
  );
}
