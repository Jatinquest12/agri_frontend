"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonClasses } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, LoadingState, SkeletonCard } from "@/components/ui/states";
import { fetchFarmById } from "@/lib/farms-api";
import type { Farm } from "@/types/platform";

export default function PublicProvenancePage() {
  const params = useParams();
  const proofId = decodeURIComponent(String(params.proofId ?? ""));
  const [farm, setFarm] = useState<Farm | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setFarm(undefined);
      const row = await fetchFarmById(proofId);
      if (!cancelled) setFarm(row);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [proofId]);

  if (farm === undefined) {
    return (
      <div className="space-y-3">
        <LoadingState label="Resolving provenance record..." />
        <SkeletonCard lines={4} />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="space-y-4">
        <Card title="Verification status">
          <Pill tone="bad">Not found</Pill>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            No provenance record for this identifier. Check the QR or hash.
          </p>
        </Card>
        <EmptyState
          title="No matching record"
          description="Try scanning again or verify the token from the source label."
        />
        <Link href="/verify" className={buttonClasses({ variant: "secondary" })}>
          Back to verifier
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public provenance"
        description="Read-only farm origin and verification metadata."
      />
      <Card title="Verification status">
        <Pill tone="ok">Verified snapshot</Pill>
        <p className="mt-2 text-xs text-slate-500">
          This page is safe to share with buyers and auditors.
        </p>
      </Card>
      <Card title="Farm origin">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Farm</dt>
            <dd className="font-medium">{farm.name}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Crop</dt>
            <dd>{farm.cropType}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Area</dt>
            <dd>{farm.areaAcres} acres</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Center GPS</dt>
            <dd className="font-mono text-xs">
              {farm.center.lat}, {farm.center.lng}
            </dd>
          </div>
        </dl>
      </Card>
      <Card title="Crop details">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {farm.healthScore != null ? (
            <>
              Health score <strong>{farm.healthScore}</strong> ·{" "}
            </>
          ) : null}
          Predicted yield{" "}
          <strong>{farm.yieldPredictionKg.toLocaleString()} kg</strong>
        </p>
      </Card>
      <Card title="Verification timestamp & chain reference">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Verified at</dt>
            <dd>{farm.lastVerifiedAt ?? new Date().toISOString()}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Proof hash</dt>
            <dd className="max-w-[60%] break-all font-mono text-xs">
              {farm.proofHash ?? "Pending"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Blockchain transaction ID</dt>
            <dd className="max-w-[60%] break-all font-mono text-xs">
              {farm.txId ?? "Pending"}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
