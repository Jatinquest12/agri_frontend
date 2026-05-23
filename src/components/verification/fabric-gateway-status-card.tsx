"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";

type ContractHealth = { ok: boolean; message?: string; error?: string };

type BlockchainStatus = {
  fabricEnabled: boolean;
  channel?: string;
  chaincode?: string;
  aggregated?: boolean;
  gatewayError?: string;
  contracts?: {
    farmRegistry: ContractHealth;
    dataAnchor: ContractHealth;
    proofStore: ContractHealth;
  };
};

export function FabricGatewayStatusCard() {
  const [chainStatus, setChainStatus] = useState<BlockchainStatus | null>(null);
  const [chainLoading, setChainLoading] = useState(true);
  const [chainError, setChainError] = useState<string | null>(null);

  const loadChainStatus = useCallback(async () => {
    setChainLoading(true);
    setChainError(null);
    try {
      const s = await apiRequest<BlockchainStatus>("/blockchain/status");
      setChainStatus(s);
    } catch (e) {
      setChainError((e as Error).message);
      setChainStatus(null);
    } finally {
      setChainLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadChainStatus();
  }, [loadChainStatus]);

  return (
    <Card title="Fabric gateway & chaincode">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => void loadChainStatus()}>
          Refresh status
        </Button>
        {chainLoading ? (
          <span className="text-xs text-slate-500">Loading…</span>
        ) : null}
      </div>
      {chainError ? (
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
          {chainError}
        </p>
      ) : null}
      {chainStatus ? (
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <span className="text-slate-500">Fabric in API:</span>{" "}
            <Pill tone={chainStatus.fabricEnabled ? "ok" : "neutral"}>
              {chainStatus.fabricEnabled ? "enabled" : "disabled"}
            </Pill>
          </p>
          {chainStatus.channel ? (
            <p className="font-mono text-xs">
              channel={chainStatus.channel} · chaincode={chainStatus.chaincode ?? "—"} ·
              aggregated={String(chainStatus.aggregated)}
            </p>
          ) : null}
          {chainStatus.gatewayError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {chainStatus.gatewayError}
            </p>
          ) : null}
          {chainStatus.contracts ? (
            <ul className="mt-2 space-y-1 font-mono text-xs">
              {(
                [
                  ["FarmRegistry", chainStatus.contracts.farmRegistry],
                  ["DataAnchor", chainStatus.contracts.dataAnchor],
                  ["ProofStore", chainStatus.contracts.proofStore],
                ] as const
              ).map(([name, c]) => (
                <li key={name}>
                  {name}:{" "}
                  <Pill tone={c.ok ? "ok" : "bad"}>
                    {c.ok ? (c.message ?? "ok") : (c.error ?? "error")}
                  </Pill>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <p className="mt-3 text-xs text-slate-500">
        From <code className="rounded bg-slate-100 px-1 dark:bg-zinc-800">GET /api/blockchain/status</code>
        .
      </p>
    </Card>
  );
}
