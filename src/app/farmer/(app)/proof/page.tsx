"use client";

import { useEffect, useState } from "react";

import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";
import { FarmCertificate } from "@/components/proof/farm-certificate";
import { QrImage } from "@/components/proof/qr-image";
import { Field } from "@/components/ui/field";
import { mockProofHistory } from "@/lib/mock-data";
import { useFarmsFromApi } from "@/hooks/use-farms-from-api";
import { FabricGatewayStatusCard } from "@/components/verification/fabric-gateway-status-card";
import { ProofHashVerifyCard } from "@/components/verification/proof-hash-verify-card";
import { createProof } from "@/lib/proof-api";
import { Button } from "@/components/ui/button";
import type { Farm } from "@/types/platform";

export default function FarmerProofPage() {
  const { farms, loading, error, reload } = useFarmsFromApi();
  const [farm, setFarm] = useState<Farm | undefined>();

  useEffect(() => {
    setFarm((prev) => {
      if (prev && farms.some((f) => f.id === prev.id)) return prev;
      return farms[0];
    });
  }, [farms]);

  const [origin, setOrigin] = useState("");
  const [proofBusy, setProofBusy] = useState(false);
  const [proofMsg, setProofMsg] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleCreateProof = async () => {
    if (!farm) return;
    setProofBusy(true);
    setProofMsg(null);
    try {
      const { proof } = await createProof(farm.id);
      setProofMsg(`Proof created: ${proof.id} (hash ${proof.content_hash.slice(0, 12)}…)`);
    } catch (e) {
      setProofMsg((e as Error).message);
    } finally {
      setProofBusy(false);
    }
  };

  const verifyUrl =
    farm && origin ? `${origin}/verify/p/${farm.id}` : farm ? `/verify/p/${farm.id}` : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proof verification"
        description="Blockchain attestation via the backend, downloadable certificate, QR payload, and hash checks (same toolchain as admin verification)."
      />
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Registry API error: {error}{" "}
          <button type="button" className="ml-1 underline" onClick={() => void reload()}>
            Retry
          </button>
        </p>
      ) : null}

      {!loading && farms.length === 0 ? (
        <EmptyState
          title="Proof unavailable"
          description="Register a farm from Add farm (POST /api/farms/register) to generate proof and QR."
        />
      ) : null}

      {loading && farms.length === 0 ? (
        <p className="text-sm text-slate-500">Loading farms…</p>
      ) : null}

      <FabricGatewayStatusCard />

      {farms.length > 1 ? (
        <Card title="Select farm">
          <Field label="Farm">
            <select
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={farm?.id ?? ""}
              onChange={(e) => {
                const next = farms.find((f) => f.id === e.target.value);
                setFarm(next);
              }}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </Field>
        </Card>
      ) : null}

      {farm ? (
        <Card title="Create proof">
          <Button
            variant="secondary"
            disabled={proofBusy}
            onClick={() => void handleCreateProof()}
          >
            {proofBusy ? "Creating…" : "POST /api/proof/create"}
          </Button>
          {proofMsg ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{proofMsg}</p>
          ) : null}
        </Card>
      ) : null}

      <ProofHashVerifyCard syncedFarmId={farm?.id} />

      {farm ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="On-chain summary">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Metadata hash</dt>
                  <dd className="font-mono text-xs">{farm.proofHash ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Transaction</dt>
                  <dd className="font-mono text-xs">{farm.txId ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Last updated</dt>
                  <dd>{farm.lastVerifiedAt ?? "—"}</dd>
                </div>
              </dl>
            </Card>
            <Card title="QR code generation">
              {verifyUrl.startsWith("http") ? (
                <QrImage
                  farmId={farm.id}
                  value={verifyUrl}
                  title="Farm verify QR"
                />
              ) : (
                <p className="text-sm text-slate-500">Preparing QR payload…</p>
              )}
            </Card>
          </div>
          <Card title="Farm certificate (PDF via print)">
            <FarmCertificate farm={farm} />
          </Card>
        </>
      ) : null}

      <Card title="Proof history">
        <p className="mb-3 text-xs text-slate-500">
          Anchored proofs from the MVP API surface on this table once wired to ledger events.
        </p>
        <DataTable className="min-w-[640px]">
          <thead>
            <HeadRow>
              <TH>Label</TH>
              <TH>Hash</TH>
              <TH>Transaction</TH>
              <TH>When</TH>
              <TH className="pr-0">Status</TH>
            </HeadRow>
          </thead>
          <tbody>
            {mockProofHistory.map((p) => (
              <BodyRow key={p.id}>
                <TD>{p.label}</TD>
                <TD className="font-mono text-xs">{p.hash}</TD>
                <TD className="font-mono text-xs">{p.txId}</TD>
                <TD className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(p.at).toLocaleString()}
                </TD>
                <TD className="pr-0">
                  <Pill tone={p.status === "valid" ? "ok" : "warn"}>{p.status}</Pill>
                </TD>
              </BodyRow>
            ))}
          </tbody>
        </DataTable>
      </Card>
    </div>
  );
}
