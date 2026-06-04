"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Field, TextArea } from "@/components/ui/field";
import { LoadingState } from "@/components/ui/states";
import { useToast } from "@/context/toast-context";
import { QrImage } from "@/components/proof/qr-image";
import { verifyProofPost } from "@/lib/proof-api";

export default function VerifyHomePage() {
  const { showToast } = useToast();
  const [hash, setHash] = useState("");
  const [proofId, setProofId] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"idle" | "ok" | "bad">("idle");
  const [detail, setDetail] = useState<string | null>(null);

  const verify = () => {
    void (async () => {
      const trimmedHash = hash.trim();
      const trimmedId = proofId.trim();
      if (!trimmedHash && !trimmedId) {
        setResult("bad");
        setDetail("Enter a proof ID or content hash.");
        showToast({
          tone: "error",
          title: "Missing input",
          description: "Provide a proof ID or hash to verify.",
        });
        return;
      }
      setBusy(true);
      setResult("idle");
      setDetail(null);
      try {
        const res = await verifyProofPost({
          proof_id: trimmedId || undefined,
          hash: trimmedHash || undefined,
        });
        const ok = res.verified;
        setResult(ok ? "ok" : "bad");
        setDetail(
          ok
            ? res.proof_id
              ? `Proof ${res.proof_id} verified on chain.`
              : "Proof verified successfully."
            : "Proof could not be verified against the ledger.",
        );
        showToast({
          tone: ok ? "success" : "error",
          title: ok ? "Proof verified" : "Verification failed",
          description: ok
            ? res.proof_id
              ? `Proof ${res.proof_id} verified.`
              : "Proof verified successfully."
            : "Proof could not be verified.",
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Verification request failed.";
        setResult("bad");
        setDetail(msg);
        showToast({ tone: "error", title: "API error", description: msg });
      } finally {
        setBusy(false);
      }
    })();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verify proof"
        description="Check a proof ID or content hash against the Agritrust registry and ledger."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Verify" },
        ]}
      />
      <Card title="Proof verification">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Proof ID" hint="Optional if you provide a hash below.">
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="proof-uuid"
              value={proofId}
              onChange={(e) => {
                setProofId(e.target.value);
                setResult("idle");
              }}
            />
          </Field>
        </div>
        <Field
          label="Content hash or scanned payload"
          hint="Paste hash from certificate or QR decode output."
          className="mt-4"
        >
          <TextArea
            className="min-h-[120px] font-mono"
            placeholder="0x… or agritrust:// payload"
            value={hash}
            onChange={(e) => {
              setHash(e.target.value);
              setResult("idle");
            }}
          />
        </Field>
        <Button className="mt-3" onClick={verify} disabled={busy}>
          {busy ? "Verifying…" : "Verify with API"}
        </Button>
        {busy ? (
          <div className="mt-3">
            <LoadingState label="Calling POST /api/proof/verify…" />
          </div>
        ) : null}
        {result !== "idle" && !busy ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm">
              Status:{" "}
              <Pill tone={result === "ok" ? "ok" : "bad"}>
                {result === "ok" ? "Verified" : "Not verified"}
              </Pill>
            </p>
            {detail ? (
              <Alert tone={result === "ok" ? "success" : "error"}>{detail}</Alert>
            ) : null}
          </div>
        ) : null}
        <p className="mt-3 text-xs text-slate-500">
          Or open a direct link:{" "}
          <Link href="/verify/scan" className="font-medium text-emerald-700 underline">
            QR scan flow
          </Link>
          {proofId.trim() ? (
            <>
              {" "}
              ·{" "}
              <Link
                href={`/verify/p/${encodeURIComponent(proofId.trim())}`}
                className="font-medium text-emerald-700 underline"
              >
                View farm record
              </Link>
            </>
          ) : null}
        </p>
      </Card>
      <Card title="QR preview">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Preview encoding for the hash or proof ID entered above.
        </p>
        <div className="mt-3">
          <QrImage
            value={
              hash.trim() ||
              proofId.trim() ||
              "https://agritrust.example/verify"
            }
          />
        </div>
      </Card>
    </div>
  );
}
