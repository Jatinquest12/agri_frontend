"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";
import { useToast } from "@/context/toast-context";
import { useFarmsFromApi } from "@/hooks/use-farms-from-api";
import {
  evaluateClaim,
  fetchClaimsByFarm,
  type InsuranceClaim,
} from "@/lib/insurance-api";

function claimTone(c: InsuranceClaim): "ok" | "warn" | "bad" | "neutral" {
  if (c.payout_released) return "ok";
  if (c.disputed) return "bad";
  if (c.triggered) return "warn";
  return "neutral";
}

function claimLabel(c: InsuranceClaim): string {
  if (c.payout_released) return "paid out";
  if (c.disputed) return "disputed";
  if (c.triggered) return "triggered";
  return "no claim";
}

export default function FarmerInsurancePage() {
  const { farms, loading: farmsLoading } = useFarmsFromApi();
  const { showToast } = useToast();

  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  const [threshold, setThreshold] = useState(45);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  // auto-select first farm
  useEffect(() => {
    if (!selectedFarmId && farms.length > 0) {
      setSelectedFarmId(farms[0].id);
    }
  }, [farms, selectedFarmId]);

  const loadClaims = useCallback(async (farmId: string) => {
    if (!farmId) return;
    setClaimsLoading(true);
    try {
      const res = await fetchClaimsByFarm(farmId);
      setClaims(res.claims);
    } catch {
      setClaims([]);
    } finally {
      setClaimsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedFarmId) void loadClaims(selectedFarmId);
  }, [selectedFarmId, loadClaims]);

  const handleEvaluate = async () => {
    if (!selectedFarmId) return;
    setEvaluating(true);
    try {
      const res = await evaluateClaim(selectedFarmId, threshold);
      showToast({
        tone: res.claim.triggered ? "warn" : "success",
        title: res.claim.triggered ? "Claim triggered" : "No claim required",
        description: res.message,
      });
      await loadClaims(selectedFarmId);
    } catch (err) {
      showToast({
        tone: "error",
        title: "Evaluation failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setEvaluating(false);
    }
  };

  const selectedFarm = farms.find((f) => f.id === selectedFarmId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insurance"
        description="Evaluate parametric insurance claims based on AI health scores. Claims are anchored on Hyperledger Fabric."
      />

      {/* Farm selector + evaluate */}
      <Card title="Run claim evaluation" tone="brand">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Farm
            </label>
            <select
              id="insurance-farm-select"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              disabled={farmsLoading}
            >
              {farmsLoading ? (
                <option>Loading farms…</option>
              ) : farms.length === 0 ? (
                <option value="">No farms registered</option>
              ) : (
                farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="w-40">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Health threshold
            </label>
            <input
              id="insurance-threshold"
              type="number"
              min={0}
              max={100}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </div>

          <Button
            id="insurance-evaluate-btn"
            onClick={() => void handleEvaluate()}
            disabled={!selectedFarmId || evaluating}
          >
            {evaluating ? "Evaluating…" : "Evaluate claim"}
          </Button>
        </div>

        {selectedFarm ? (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Farm{" "}
            <span className="font-mono font-semibold">{selectedFarmId}</span> ·
            Area: {selectedFarm.areaAcres} acres · Crop: {selectedFarm.cropType}
          </p>
        ) : null}
      </Card>

      {/* Claims history */}
      <Card
        title="Claims history"
        subtitle={`POST /api/insurance/:farmId/evaluate · GET /api/insurance/:farmId/claims`}
      >
        {claimsLoading ? (
          <p className="py-4 text-sm text-slate-500">Loading claims…</p>
        ) : claims.length === 0 ? (
          <EmptyState
            title="No claims yet"
            description="Select a farm and run an evaluation to generate a claim."
          />
        ) : (
          <DataTable>
            <thead>
              <HeadRow>
                <TH>Claim ID</TH>
                <TH>Health score</TH>
                <TH>Threshold</TH>
                <TH>Status</TH>
                <TH>Date</TH>
                <TH>Tx ID</TH>
              </HeadRow>
            </thead>
            <tbody>
              {claims.map((c) => (
                <BodyRow key={c.id}>
                  <TD className="font-mono text-xs">{c.id.slice(0, 14)}…</TD>
                  <TD>{c.health_score.toFixed(1)}</TD>
                  <TD>{c.threshold}</TD>
                  <TD>
                    <Pill tone={claimTone(c)}>{claimLabel(c)}</Pill>
                  </TD>
                  <TD className="text-xs text-slate-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </TD>
                  <TD className="font-mono text-xs text-slate-400">
                    {c.blockchain_tx_id ? `${c.blockchain_tx_id.slice(0, 10)}…` : "—"}
                  </TD>
                </BodyRow>
              ))}
            </tbody>
          </DataTable>
        )}
      </Card>
    </div>
  );
}
