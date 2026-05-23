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
      ? "border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 to-white dark:border-emerald-900/70 dark:from-emerald-950/20 dark:to-slate-900"
      : tone === "subtle"
        ? "border-slate-200/90 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60"
        : "border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/80";

  return (
    <section
      className={`surface-card rounded-2xl border p-5 shadow-sm ${interactive ? "card-motion" : ""} ${toneClass} ${className}`}
    >
      {title ? (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[1.05rem] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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
    ok: "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    warn: "border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
    bad: "border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${map[tone]}`}
    >
      {children}
    </span>
  );
}
