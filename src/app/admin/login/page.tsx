"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { DEMO_OTP, DEMO_PHONE } from "@/lib/demo-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { sendOtp, verifyOtp, otpSent, pendingPhone, authError } = useAuth();
  const { showToast } = useToast();
  const [phone, setPhone] = useState(DEMO_PHONE);
  const [code, setCode] = useState(DEMO_OTP);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="app-backdrop flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-10 dark:bg-zinc-950">
      <div className="surface-card w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900/85">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Operations Access
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Staff sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Demo: mobile{" "}
          <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
            {DEMO_PHONE}
          </code>
          , OTP{" "}
          <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
            {DEMO_OTP}
          </code>
          . This number is in backend <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">ADMIN_PHONES</code>{" "}
          for admin access.
        </p>
        <label className="mt-5 block text-sm">
          <span className="font-medium">Mobile number</span>
          <input
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={DEMO_PHONE}
            disabled={otpSent}
          />
        </label>
        {!otpSent ? (
          <button
            type="button"
            disabled={busy}
            className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
            onClick={() => {
              void (async () => {
                setError("");
                setBusy(true);
                try {
                  await sendOtp(phone);
                  showToast({
                    tone: "success",
                    title: "OTP sent",
                    description: "Use DEMO_OTP from backend in dev.",
                  });
                } catch (err) {
                  const msg =
                    err instanceof Error ? err.message : "Failed to send OTP.";
                  setError(msg);
                } finally {
                  setBusy(false);
                }
              })();
            }}
          >
            Send OTP
          </button>
        ) : (
          <>
            <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              OTP sent to {pendingPhone || phone}.
            </p>
            <label className="mt-3 block text-sm">
              <span className="font-medium">OTP</span>
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 tracking-[0.28em] dark:border-slate-700 dark:bg-slate-950"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
              />
            </label>
            <button
              type="button"
              disabled={busy}
              className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
              onClick={() => {
                void (async () => {
                  setBusy(true);
                  setError("");
                  const ok = await verifyOtp(code);
                  setBusy(false);
                  if (!ok) {
                    setError(authError ?? "Invalid OTP.");
                    return;
                  }
                  showToast({
                    tone: "success",
                    title: "Signed in",
                    description: "Opening admin console.",
                  });
                  router.replace("/admin");
                })();
              }}
            >
              Verify & continue
            </button>
          </>
        )}
        {error || authError ? (
          <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {error || authError}
          </p>
        ) : null}
        <p className="mt-5 text-center text-xs text-slate-500">
          <Link href="/" className="underline">
            Back to portals
          </Link>
        </p>
      </div>
    </div>
  );
}
