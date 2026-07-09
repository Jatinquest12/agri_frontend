import { OtpLoginCard } from "@/components/auth/otp-login-card";
import { ADMIN_DEMO_PHONE, DEMO_OTP, DEMO_PHONE } from "@/lib/demo-auth";

export default function FarmerLoginPage() {
  return (
    <div className="app-backdrop flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#E8F5E9]/70 to-slate-50 px-4 py-10 dark:from-zinc-950 dark:to-zinc-950">
      <OtpLoginCard
        portalLabel="Agritrust · Farmer workspace"
        heading="Sign in with mobile OTP"
        demoHint={
          <>
            Pilot demo — mobile{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
              {DEMO_PHONE}
            </code>
            , OTP{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
              {DEMO_OTP}
            </code>
            .
          </>
        }
        demoPhone={DEMO_PHONE}
        demoOtp={DEMO_OTP}
        redirectTo="/farmer"
      />
    </div>
  );
}
