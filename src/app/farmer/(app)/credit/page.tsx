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
  fetchLatestCreditScore,
  generateCreditScore,
  type CreditProfile,
} from "@/lib/credit-api";

function gradeTone(
  grade: string,
): "ok" | "warn" | "bad" | "neutral" {
  if (grade === "A" || grade === "AA") return "ok";
  if (grade === "B") return "warn";
  if (grade === "C" || grade === "D") return "bad";
  return "neutral";
}

export default function FarmerCreditPage() {
  const { farms, loading: farmsLoading } = useFarmsFromApi();
  const { showToast } = useToast();

  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  const [profile, setProfile] = useState<CreditProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // auto-select first farm
  useEffect(() => {
    if (!selectedFarmId && farms.length > 0) {
      setSelectedFarmId(farms[0].id);
    }
  }, [farms, selectedFarmId]);

  const loadLatest = useCallback(async (farmId: string) => {
    if (!farmId) return;
    setProfileLoading(true);
    try {
      const res = await fetchLatestCreditScore(farmId);
      setProfile(res.creditProfile);
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedFarmId) void loadLatest(selectedFarmId);
  }, [selectedFarmId, loadLatest]);

  const handleGenerate = async () => {
    if (!selectedFarmId) return;
    setGenerating(true);
    try {
      const res = await generateCreditScore(selectedFarmId);
      setProfile(res.creditProfile);
      showToast({
        tone: "success",
        title: "Credit score generated",
        description: `Grade ${res.creditProfile.grade} · Score ${res.creditProfile.score}`,
      });
    } catch (err) {
      showToast({
        tone: "error",
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Credit score"
        description="Generate and view your farm's credit profile for financial institution access. Scores are derived from AI health, yield predictions, and proof history."
      />

      {/* Farm selector + generate */}
      <Card title="Generate credit score" tone="brand">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Farm
            </label>
            <select
              id="credit-farm-select"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={selectedFarmId}
              onChange={(e) => {
                setSelectedFarmId(e.target.value);
                setProfile(null);
              }}
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
          <Button
            id="credit-generate-btn"
            onClick={() => void handleGenerate()}
            disabled={!selectedFarmId || generating}
          >
            {generating ? "Generating…" : "Generate score"}
          </Button>
        </div>
      </Card>

      {/* Score display */}
      <Card
        title="Latest credit profile"
        subtitle="GET /api/credit/:farmId/latest · POST /api/credit/:farmId/generate"
      >
        {profileLoading ? (
          <p className="py-4 text-sm text-slate-500">Loading profile…</p>
        ) : !profile ? (
          <EmptyState
            title="No credit profile yet"
            description="Select a farm and click 'Generate score' to create your credit profile."
          />
        ) : (
          <div className="space-y-5">
            {/* Score hero */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
                <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                  {profile.score}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">/ 100</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Grade</span>
                  <Pill tone={gradeTone(profile.grade)}>{profile.grade}</Pill>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Eligible loan:{" "}
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    ₹{profile.eligible_loan_amount_inr.toLocaleString("en-IN")}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Generated {new Date(profile.generated_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Factor breakdown */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Score factors
              </p>
              <DataTable>
                <thead>
                  <HeadRow>
                    <TH>Factor</TH>
                    <TH>Value</TH>
                  </HeadRow>
                </thead>
                <tbody>
                  <BodyRow>
                    <TD>Health score</TD>
                    <TD>{profile.factors.health_score.toFixed(1)}</TD>
                  </BodyRow>
                  <BodyRow>
                    <TD>Proof documents</TD>
                    <TD>{profile.factors.proof_count}</TD>
                  </BodyRow>
                  <BodyRow>
                    <TD>Predicted yield (kg)</TD>
                    <TD>{profile.factors.yield_predicted.toLocaleString()}</TD>
                  </BodyRow>
                  <BodyRow>
                    <TD>Land area (acres)</TD>
                    <TD>{profile.factors.land_area}</TD>
                  </BodyRow>
                </tbody>
              </DataTable>
            </div>

            {profile.blockchain_tx_id ? (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Blockchain Tx:{" "}
                <span className="font-mono">{profile.blockchain_tx_id}</span>
              </p>
            ) : null}
          </div>
        )}
      </Card>
    </div>
  );
}
