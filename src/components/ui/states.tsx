import type { ReactNode } from "react";
import { Layers } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center transition-colors hover:border-[#DDEFD8] hover:bg-[#E8F5E9]/50 dark:border-slate-800 dark:bg-slate-900/20 dark:hover:border-emerald-900/50">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32] dark:bg-emerald-900/50 dark:text-emerald-300">
        <Layers className="h-6 w-6" />
      </div>
      <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[#2E7D32]" />
      {label}
    </div>
  );
}

export function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`shimmer rounded-lg ${className}`} aria-hidden />;
}

export function SkeletonCard({
  lines = 3,
}: {
  lines?: number;
}) {
  return (
    <div className="surface-card rounded-2xl border p-5">
      <SkeletonBlock className="h-5 w-40" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBlock
            key={i}
            className={`h-3 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}
