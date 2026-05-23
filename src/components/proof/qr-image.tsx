"use client";

import { useEffect, useState } from "react";

import { fetchFarmQr } from "@/lib/farms-api";

export function QrImage({
  farmId,
  value,
  title = "Verification QR",
}: {
  /** When set, loads QR from GET /api/farms/:farmId/qr */
  farmId?: string;
  /** Fallback payload URL when farmId is not provided */
  value?: string;
  title?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [payloadLabel, setPayloadLabel] = useState(value ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!farmId) {
      if (value) {
        setSrc(
          `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(value)}`,
        );
        setPayloadLabel(value);
      }
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const { data_url, payload } = await fetchFarmQr(farmId);
        if (cancelled) return;
        setSrc(data_url);
        setPayloadLabel(JSON.stringify(payload));
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "QR load failed");
        if (value) {
          setSrc(
            `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(value)}`,
          );
          setPayloadLabel(value);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [farmId, value]);

  if (!src && !error) {
    return (
      <p className="text-sm text-slate-500">Loading QR code…</p>
    );
  }

  return (
    <div className="surface-card flex flex-col items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      {error ? (
        <p className="text-xs text-amber-700 dark:text-amber-300">{error}</p>
      ) : null}
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={title}
          width={180}
          height={180}
          loading="lazy"
          className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700"
        />
      ) : null}
      <p className="max-w-[220px] break-all text-xs text-slate-500 dark:text-slate-400">
        Payload: {payloadLabel}
      </p>
    </div>
  );
}
