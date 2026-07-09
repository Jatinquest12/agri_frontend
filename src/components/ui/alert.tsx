import type { ReactNode } from "react";

type AlertTone = "info" | "success" | "warning" | "error";

const tones: Record<AlertTone, string> = {
  info: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
  success:
    "border-[#DDEFD8] bg-[#E8F5E9] text-[#1B4332] dark:border-[#2E7D32]/50 dark:bg-[#1B4332]/40 dark:text-[#A5D6A7]",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100",
  error:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100",
};

export function Alert({
  tone = "info",
  title,
  children,
  actions,
}: {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-1 leading-relaxed" : "leading-relaxed"}>
        {children}
      </div>
      {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
