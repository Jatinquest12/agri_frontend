"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";
import { useToast } from "@/context/toast-context";
import {
  claimTransfer,
  fetchAllTokens,
  hashSecret,
  mintToken,
  recallToken,
  transferToken,
  type CommodityToken,
} from "@/lib/marketplace-api";

function statusTone(
  s: CommodityToken["status"],
): "ok" | "warn" | "bad" | "neutral" {
  if (s === "ACTIVE") return "ok";
  if (s === "LOCKED") return "warn";
  if (s === "RECALLED") return "bad";
  return "neutral";
}

export default function AdminMarketplacePage() {
  const { showToast } = useToast();

  const [tokens, setTokens] = useState<CommodityToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Mint form state
  const [mintForm, setMintForm] = useState({
    farm_id: "",
    harvest_ref: "",
    batch_hash: "",
    owner_did_hash: "",
    qr_code_ref: "",
  });
  const [minting, setMinting] = useState(false);

  // Hash-secret helper
  const [secretInput, setSecretInput] = useState("");
  const [hashResult, setHashResult] = useState("");

  // HTLC transfer form
  const [transferForm, setTransferForm] = useState({
    token_id: "",
    to_owner_did_hash: "",
    htlc_hash_lock: "",
  });
  const [transferring, setTransferring] = useState(false);

  // Claim form
  const [claimForm, setClaimForm] = useState({
    token_id: "",
    htlc_secret: "",
  });
  const [claiming, setClaiming] = useState(false);

  // Recall
  const [recallForm, setRecallForm] = useState({
    token_id: "",
    recall_reason: "",
  });
  const [recalling, setRecalling] = useState(false);

  const loadTokens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllTokens();
      setTokens(res.tokens);
    } catch {
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTokens();
  }, [loadTokens]);

  const handleMint = async () => {
    const { farm_id, harvest_ref, batch_hash, owner_did_hash, qr_code_ref } =
      mintForm;
    if (!farm_id || !harvest_ref || !batch_hash || !owner_did_hash || !qr_code_ref) {
      showToast({ tone: "error", title: "All fields required for minting" });
      return;
    }
    setMinting(true);
    try {
      const res = await mintToken(mintForm);
      showToast({
        tone: "success",
        title: "Token minted",
        description: `Token ${res.token.id} is now ACTIVE`,
      });
      setMintForm({
        farm_id: "",
        harvest_ref: "",
        batch_hash: "",
        owner_did_hash: "",
        qr_code_ref: "",
      });
      await loadTokens();
    } catch (err) {
      showToast({
        tone: "error",
        title: "Mint failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setMinting(false);
    }
  };

  const handleHashSecret = async () => {
    if (!secretInput) return;
    try {
      const res = await hashSecret(secretInput);
      setHashResult(res.htlc_hash_lock);
    } catch (err) {
      showToast({
        tone: "error",
        title: "Hash failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleTransfer = async () => {
    const { token_id, to_owner_did_hash, htlc_hash_lock } = transferForm;
    if (!token_id || !to_owner_did_hash || !htlc_hash_lock) {
      showToast({ tone: "error", title: "All transfer fields required" });
      return;
    }
    setTransferring(true);
    try {
      const res = await transferToken(token_id, to_owner_did_hash, htlc_hash_lock);
      showToast({
        tone: "success",
        title: "Transfer initiated",
        description: `Token ${res.token_id} is now LOCKED`,
      });
      setTransferForm({ token_id: "", to_owner_did_hash: "", htlc_hash_lock: "" });
      await loadTokens();
    } catch (err) {
      showToast({
        tone: "error",
        title: "Transfer failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setTransferring(false);
    }
  };

  const handleClaim = async () => {
    const { token_id, htlc_secret } = claimForm;
    if (!token_id || !htlc_secret) {
      showToast({ tone: "error", title: "Token ID and HTLC secret required" });
      return;
    }
    setClaiming(true);
    try {
      const res = await claimTransfer(token_id, htlc_secret);
      showToast({
        tone: "success",
        title: "Transfer claimed",
        description: `Token ${res.token_id} is now ACTIVE under new owner`,
      });
      setClaimForm({ token_id: "", htlc_secret: "" });
      await loadTokens();
    } catch (err) {
      showToast({
        tone: "error",
        title: "Claim failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setClaiming(false);
    }
  };

  const handleRecall = async () => {
    const { token_id, recall_reason } = recallForm;
    if (!token_id || !recall_reason) {
      showToast({ tone: "error", title: "Token ID and recall reason required" });
      return;
    }
    setRecalling(true);
    setBusyId(token_id);
    try {
      const res = await recallToken(token_id, recall_reason);
      showToast({
        tone: "warn",
        title: "Token recalled",
        description: `Token ${res.token_id} is now RECALLED`,
      });
      setRecallForm({ token_id: "", recall_reason: "" });
      await loadTokens();
    } catch (err) {
      showToast({
        tone: "error",
        title: "Recall failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setRecalling(false);
      setBusyId(null);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace tokens"
        description="Manage commodity tokens on Hyperledger Fabric. Mint, transfer (HTLC), claim, and recall crop tokens for verified farms."
      />

      {/* ── Token list ── */}
      <Card
        title="All tokens"
        subtitle="GET /api/marketplace/tokens"
        actions={
          <Button size="sm" variant="secondary" onClick={() => void loadTokens()}>
            Refresh
          </Button>
        }
      >
        {loading ? (
          <p className="py-4 text-sm text-slate-500">Loading tokens…</p>
        ) : tokens.length === 0 ? (
          <EmptyState
            title="No tokens minted"
            description="Mint a commodity token for a verified farm below."
          />
        ) : (
          <DataTable>
            <thead>
              <HeadRow>
                <TH>Token ID</TH>
                <TH>Farm</TH>
                <TH>Harvest ref</TH>
                <TH>Status</TH>
                <TH>Minted</TH>
                <TH>Tx ID</TH>
              </HeadRow>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <BodyRow
                  key={t.id}
                  className={busyId === t.id ? "opacity-50" : ""}
                >
                  <TD className="font-mono text-xs">{t.id.slice(0, 14)}…</TD>
                  <TD className="font-mono text-xs">{t.farm_id.slice(0, 12)}…</TD>
                  <TD>{t.harvest_ref}</TD>
                  <TD>
                    <Pill tone={statusTone(t.status)}>{t.status}</Pill>
                  </TD>
                  <TD className="text-xs text-slate-500">
                    {new Date(t.minted_at).toLocaleDateString()}
                  </TD>
                  <TD className="font-mono text-xs text-slate-400">
                    {t.blockchain_tx_id
                      ? `${t.blockchain_tx_id.slice(0, 10)}…`
                      : "—"}
                  </TD>
                </BodyRow>
              ))}
            </tbody>
          </DataTable>
        )}
      </Card>

      {/* ── Operations ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Mint */}
        <Card title="Mint token" subtitle="POST /api/marketplace/tokens/mint">
          <div className="space-y-3">
            {(
              [
                ["farm_id", "Farm ID"],
                ["harvest_ref", "Harvest ref (e.g. HARVEST-2025-001)"],
                ["batch_hash", "Batch hash (SHA-256)"],
                ["owner_did_hash", "Owner DID hash"],
                ["qr_code_ref", "QR code ref"],
              ] as const
            ).map(([key, placeholder]) => (
              <input
                key={key}
                id={`mint-${key}`}
                className={inputClass}
                placeholder={placeholder}
                value={mintForm[key]}
                onChange={(e) =>
                  setMintForm((p) => ({ ...p, [key]: e.target.value }))
                }
              />
            ))}
            <Button
              id="mint-token-btn"
              onClick={() => void handleMint()}
              disabled={minting}
            >
              {minting ? "Minting…" : "Mint token"}
            </Button>
          </div>
        </Card>

        {/* Hash-secret helper */}
        <Card
          title="HTLC hash helper"
          subtitle="POST /api/marketplace/tokens/hash-secret"
        >
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Generate the SHA-256 hash of your secret to use as{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
              htlc_hash_lock
            </code>
            . Keep the secret private; share only the hash.
          </p>
          <div className="space-y-3">
            <input
              id="htlc-secret-input"
              className={inputClass}
              placeholder="Enter HTLC secret"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
            />
            <Button
              id="hash-secret-btn"
              variant="secondary"
              onClick={() => void handleHashSecret()}
            >
              Compute hash
            </Button>
            {hashResult ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                <p className="mb-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  htlc_hash_lock
                </p>
                <p className="break-all font-mono text-xs text-slate-700 dark:text-slate-300">
                  {hashResult}
                </p>
              </div>
            ) : null}
          </div>
        </Card>

        {/* Transfer (HTLC initiate) */}
        <Card
          title="Initiate HTLC transfer"
          subtitle="POST /api/marketplace/tokens/:tokenId/transfer"
        >
          <div className="space-y-3">
            <input
              id="transfer-token-id"
              className={inputClass}
              placeholder="Token ID"
              value={transferForm.token_id}
              onChange={(e) =>
                setTransferForm((p) => ({ ...p, token_id: e.target.value }))
              }
            />
            <input
              id="transfer-to-owner"
              className={inputClass}
              placeholder="To owner DID hash"
              value={transferForm.to_owner_did_hash}
              onChange={(e) =>
                setTransferForm((p) => ({
                  ...p,
                  to_owner_did_hash: e.target.value,
                }))
              }
            />
            <input
              id="transfer-hash-lock"
              className={inputClass}
              placeholder="HTLC hash lock (from helper above)"
              value={transferForm.htlc_hash_lock}
              onChange={(e) =>
                setTransferForm((p) => ({
                  ...p,
                  htlc_hash_lock: e.target.value,
                }))
              }
            />
            <Button
              id="initiate-transfer-btn"
              variant="secondary"
              onClick={() => void handleTransfer()}
              disabled={transferring}
            >
              {transferring ? "Transferring…" : "Initiate transfer (LOCK)"}
            </Button>
          </div>
        </Card>

        {/* Claim transfer */}
        <Card
          title="Claim transfer"
          subtitle="POST /api/marketplace/tokens/:tokenId/claim"
        >
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Buyer reveals the HTLC secret to complete the transfer and activate
            the token under the new owner.
          </p>
          <div className="space-y-3">
            <input
              id="claim-token-id"
              className={inputClass}
              placeholder="Token ID"
              value={claimForm.token_id}
              onChange={(e) =>
                setClaimForm((p) => ({ ...p, token_id: e.target.value }))
              }
            />
            <input
              id="claim-htlc-secret"
              className={inputClass}
              placeholder="HTLC secret (pre-image)"
              value={claimForm.htlc_secret}
              onChange={(e) =>
                setClaimForm((p) => ({ ...p, htlc_secret: e.target.value }))
              }
            />
            <Button
              id="claim-transfer-btn"
              onClick={() => void handleClaim()}
              disabled={claiming}
            >
              {claiming ? "Claiming…" : "Claim transfer (ACTIVATE)"}
            </Button>
          </div>
        </Card>

        {/* Recall */}
        <Card
          title="Recall token"
          subtitle="POST /api/marketplace/tokens/:tokenId/recall"
        >
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Admin-only. Marks a token as RECALLED on-chain due to quality,
            safety, or fraud reasons.
          </p>
          <div className="space-y-3">
            <input
              id="recall-token-id"
              className={inputClass}
              placeholder="Token ID"
              value={recallForm.token_id}
              onChange={(e) =>
                setRecallForm((p) => ({ ...p, token_id: e.target.value }))
              }
            />
            <input
              id="recall-reason"
              className={inputClass}
              placeholder="Recall reason"
              value={recallForm.recall_reason}
              onChange={(e) =>
                setRecallForm((p) => ({
                  ...p,
                  recall_reason: e.target.value,
                }))
              }
            />
            <Button
              id="recall-token-btn"
              variant="danger"
              onClick={() => void handleRecall()}
              disabled={recalling}
            >
              {recalling ? "Recalling…" : "Recall token"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
