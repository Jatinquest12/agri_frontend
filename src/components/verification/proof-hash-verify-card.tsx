"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { verifyProofPost } from "@/lib/proof-api";

type VerifyResponse = {
  verified: boolean;
  chain: { tx_id?: string; type?: string } | null;
  document: { farm_id?: string; content_hash?: string } | null;
};

export function ProofHashVerifyCard({
  syncedFarmId,
}: {
  /** When set (e.g. selected farm id), fills and updates Farm ID input. */
  syncedFarmId?: string;
}) {
  const [hash, setHash] = useState("");
  const [farmId, setFarmId] = useState(syncedFarmId ?? "");
  const [tamperSim, setTamperSim] = useState(false);

  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    if (syncedFarmId != null && syncedFarmId.length > 0) {
      setFarmId(syncedFarmId);
    }
  }, [syncedFarmId]);

  const runVerify = async () => {
    setVerifyLoading(true);
    setVerifyError(null);
    setVerifyResult(null);
    setTamperSim(false);
    try {
      const result = await verifyProofPost({
        farm_id: farmId.trim(),
        hash: hash.trim(),
      });
      setVerifyResult(result);
    } catch (e) {
      setVerifyError((e as Error).message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const displayOk = verifyResult?.verified === true && !tamperSim;

  return (
    <Card title="Proof verification">
      <Field label="Farm ID">
        <Input
          placeholder="farm id from registry"
          value={farmId}
          onChange={(e) => setFarmId(e.target.value)}
        />
      </Field>
      <Field label="Proof content hash" className="mt-3">
        <Input
          placeholder="full content hash"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />
      </Field>
      <Button
        className="mt-3"
        variant="secondary"
        disabled={verifyLoading || !farmId.trim() || !hash.trim()}
        onClick={() => void runVerify()}
      >
        {verifyLoading ? "Verifying…" : "Verify on backend"}
      </Button>
      {verifyError ? (
        <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">
          {verifyError}
        </p>
      ) : null}
      {verifyResult ? (
        <div className="mt-3 space-y-1 text-sm">
          <p>
            Status:{" "}
            <Pill tone={displayOk ? "ok" : "bad"}>
              {tamperSim
                ? "Tampered / mismatch (simulated)"
                : verifyResult.verified
                  ? "Verified (on-chain or local document)"
                  : "Not verified"}
            </Pill>
          </p>
          {verifyResult.chain?.tx_id ? (
            <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
              chain tx: {verifyResult.chain.tx_id}
            </p>
          ) : null}
          {verifyResult.document?.content_hash ? (
            <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
              document hash: {verifyResult.document.content_hash}
            </p>
          ) : null}
        </div>
      ) : null}
      <Button
        className="mt-2"
        size="sm"
        variant="ghost"
        onClick={() => setTamperSim(true)}
        disabled={!verifyResult}
      >
        Simulate tampered proof detection (UI only)
      </Button>
    </Card>
  );
}
