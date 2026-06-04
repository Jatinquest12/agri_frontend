import Link from "next/link";

import type { PortalCard } from "@/types/site-content";

type PortalSectionProps = {
  portals: PortalCard[];
};

export function PortalSection({ portals }: PortalSectionProps) {
  return (
    <section
      id="access"
      aria-labelledby="access-heading"
      className="scroll-mt-28"
    >
      <div className="mb-6">
        <h2
          id="access-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          Platform access
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Choose the workspace that matches your role. Each portal shares the same
          farm registry and proof APIs.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {portals.map((portal) => (
          <article
            key={portal.href}
            className="surface-card card-motion flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900/80"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              {portal.audience}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {portal.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {portal.description}
            </p>
            <Link
              href={portal.href}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {portal.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
