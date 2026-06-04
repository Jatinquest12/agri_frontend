import type { StatItem } from "@/types/site-content";

type StatsSectionProps = {
  items: StatItem[];
};

export function StatsSection({ items }: StatsSectionProps) {
  return (
    <section aria-label="Platform highlights" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="surface-card rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {item.label}
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {item.value}
          </p>
          {item.detail ? (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{item.detail}</p>
          ) : null}
        </div>
      ))}
    </section>
  );
}
