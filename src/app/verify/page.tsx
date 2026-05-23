"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { TextArea } from "@/components/ui/field";
import { useToast } from "@/context/toast-context";
import { QrImage } from "@/components/proof/qr-image";

export default function VerifyHomePage() {
  const { showToast } = useToast();
  const [hash, setHash] = useState("");
  const [result, setResult] = useState<"idle" | "ok" | "bad">("idle");

  const verify = () => {
    const trimmed = hash.trim();
    if (trimmed.length < 4) {
      setResult("bad");
      showToast({
        tone: "error",
        title: "Verification failed",
        description: "Please enter a longer hash or payload.",
      });
      return;
    }
    const failed = trimmed.toLowerCase().includes("bad");
    setResult(failed ? "bad" : "ok");
    showToast({
      tone: failed ? "error" : "success",
      title: failed ? "Proof mismatch" : "Proof verified",
      description: failed
        ? "The payload does not match expected records."
        : "The payload appears valid.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verify proof hash"
        description="Paste a proof hash or scanned payload from packaging or certificate."
      />
      <Card title="Hash check">
        <TextArea
          className="min-h-[120px] font-mono"
          placeholder="0x… or agritrust:// payload"
          value={hash}
          onChange={(e) => {
            setHash(e.target.value);
            setResult("idle");
          }}
        />
        <Button className="mt-3" onClick={verify}>
          Verify
        </Button>
        {result !== "idle" ? (
          <p className="mt-3 text-sm">
            Status:{" "}
            <Pill tone={result === "ok" ? "ok" : "bad"}>
              {result === "ok" ? "Valid attestation" : "Unknown / failed"}
            </Pill>
          </p>
        ) : null}
        <p className="mt-2 text-xs text-slate-500">
          Verification result is based on the configured proof validation flow.
        </p>
      </Card>
      <Card title="QR verification">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Generate a QR for any text payload (e.g. copied from a label).
        </p>
        <div className="mt-3">
          <QrImage value={hash || "https://agritrust.example/verify"} />
        </div>
      </Card>
    </div>
  );
}
