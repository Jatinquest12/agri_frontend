"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input } from "@/components/ui/field";
import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/types/platform";
import { useToast } from "@/context/toast-context";

type OtpLoginCardProps = {
  portalLabel: string;
  heading: string;
  demoHint: ReactNode;
  demoPhone: string;
  demoOtp: string;
  redirectTo: string;
  allowedRoles?: UserRole[];
  primaryButtonClass?: string;
};

export function OtpLoginCard({
  portalLabel,
  heading,
  demoHint,
  demoPhone,
  demoOtp,
  redirectTo,
  allowedRoles,
  primaryButtonClass,
}: OtpLoginCardProps) {
  const router = useRouter();
  const {
    sendOtp,
    verifyOtp,
    resetOtpFlow,
    otpSent,
    pendingPhone,
    authError,
  } = useAuth();
  const { showToast } = useToast();
  const [phone, setPhone] = useState(demoPhone);
  const [code, setCode] = useState(demoOtp);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    resetOtpFlow();
  }, [resetOtpFlow]);

  const primaryClass =
    primaryButtonClass ??
    "w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60";

  return (
    <div className="surface-card w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900/85">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
        {portalLabel}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {heading}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {demoHint}
      </p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Field label="Mobile number">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={demoPhone}
            disabled={otpSent}
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(error)}
          />
        </Field>

        {!otpSent ? (
          <button
            type="button"
            disabled={busy}
            className={primaryClass}
            onClick={() => {
              void (async () => {
                setError("");
                setBusy(true);
                try {
                  await sendOtp(phone);
                  showToast({
                    tone: "success",
                    title: "OTP sent",
                    description: "Check backend logs if DEMO_OTP is not configured.",
                  });
                } catch (err) {
                  const msg =
                    err instanceof Error ? err.message : "Failed to send OTP.";
                  setError(msg);
                  showToast({ tone: "error", title: "OTP failed", description: msg });
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
            <Alert tone="success" title="OTP sent">
              Code sent to {pendingPhone || phone}. Enter the verification code below.
            </Alert>
            <Field label="Verification code">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-invalid={Boolean(error)}
              />
            </Field>
            <button
              type="button"
              disabled={busy}
              className={primaryClass}
              onClick={() => {
                void (async () => {
                  setBusy(true);
                  setError("");
                  const ok = await verifyOtp(
                    code,
                    phone,
                    allowedRoles ? { allowedRoles } : undefined,
                  );
                  setBusy(false);
                  if (!ok) {
                    const msg = authError ?? "Invalid OTP.";
                    setError(msg);
                    showToast({
                      tone: "error",
                      title: "Sign in failed",
                      description: msg,
                    });
                    return;
                  }
                  showToast({
                    tone: "success",
                    title: "Signed in",
                    description: "Redirecting to your workspace.",
                  });
                  router.replace(redirectTo);
                })();
              }}
            >
              Verify & continue
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                resetOtpFlow();
                setCode("");
                setError("");
              }}
            >
              Use a different number
            </Button>
          </>
        )}
      </form>

      {error || authError ? (
        <div className="mt-3">
          <Alert tone="error">{error || authError}</Alert>
        </div>
      ) : null}

      <p className="mt-5 text-center text-xs text-slate-500">
        <Link href="/" className="underline hover:text-slate-700 dark:hover:text-slate-300">
          Back to home
        </Link>
      </p>
    </div>
  );
}
