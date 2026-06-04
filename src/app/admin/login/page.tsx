import { OtpLoginCard } from "@/components/auth/otp-login-card";
import { ADMIN_DEMO_PHONE, DEMO_OTP } from "@/lib/demo-auth";

export default function AdminLoginPage() {
  return (
    <div className="app-backdrop flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-10 dark:bg-zinc-950">
      <OtpLoginCard
        portalLabel="Agritrust · Admin console"
        heading="Staff sign in with OTP"
        demoHint={
          <>
            Pilot demo — mobile{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
              {ADMIN_DEMO_PHONE}
            </code>
            , OTP{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
              {DEMO_OTP}
            </code>
            . Backend must list this number in{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
              ADMIN_PHONES
            </code>
            .
          </>
        }
        demoPhone={ADMIN_DEMO_PHONE}
        demoOtp={DEMO_OTP}
        redirectTo="/admin"
        allowedRoles={["admin", "agronomist"]}
        primaryButtonClass="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      />
    </div>
  );
}
