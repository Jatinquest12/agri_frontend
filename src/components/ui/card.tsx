import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  children,
  actions,
  tone = "default",
  interactive = true,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  tone?: "default" | "brand" | "subtle";
  interactive?: boolean;
  className?: string;
}) {
  const toneClass =
    tone === "brand"
      ? "border-emerald-200/50 bg-gradient-to-br from-emerald-50/90 to-white dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-slate-900/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]"
      : tone === "subtle"
        ? "border-slate-100/80 bg-slate-50/60 dark:border-slate-800/80 dark:bg-slate-900/50"
        : "border-slate-100/90 bg-white dark:border-slate-800/90 dark:bg-slate-900/80";

  return (
    <section
      className={`surface-card rounded-3xl border p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] ${interactive ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.3)]" : ""} ${toneClass} ${className}`}
    >
      {title ? (
        <header className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "bad";
}) {
  const map = {
    neutral:
      "border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200",
    ok: "border border-emerald-100 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300",
    warn: "border border-amber-200/60 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300",
    bad: "border border-red-200/60 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${map[tone]}`}
    >
      {children}
    </span>
  );
}
