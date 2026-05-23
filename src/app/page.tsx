import Link from "next/link";

const portals = [
  {
    title: "Farmer workspace",
    description: "Manage farms, monitor crop status, and share verified records.",
    href: "/farmer/login",
    cta: "Open farmer",
    tone: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  {
    title: "Admin console",
    description: "Review approvals, operations, and verification activity.",
    href: "/admin/login",
    cta: "Open admin",
    tone: "bg-slate-900 text-white hover:bg-slate-800",
  },
  {
    title: "Public verifier",
    description: "Check proof validity and provenance without login.",
    href: "/verify",
    cta: "Open verify",
    tone: "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-900 dark:text-slate-50 dark:ring-zinc-700 dark:hover:bg-zinc-800",
  },
];

export default function HomePage() {
  return (
    <div className="app-backdrop min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 text-slate-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 dark:text-slate-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:px-8">
        <header className="surface-card rounded-3xl border border-slate-200/80 bg-white/90 p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            Agritrust Platform
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
            Farm operations and verification platform
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
            One platform for farmer workflows, admin approvals, and public proof checks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/farmer/login"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Launch Farmer App
            </Link>
            <Link
              href="/admin/login"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Launch Admin Dashboard
            </Link>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Farm workflows", value: "End-to-end" },
              { label: "Verification mode", value: "Internal + public" },
              { label: "Architecture", value: "API-ready Next.js" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/60"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {kpi.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </header>
        <section className="grid gap-5 md:grid-cols-3">
          {portals.map((p) => (
            <article
              key={p.href}
              className="surface-card flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900/80"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {p.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {p.description}
              </p>
              <Link
                href={p.href}
                className={`mt-5 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ${p.tone}`}
              >
                {p.cta}
              </Link>
            </article>
          ))}
        </section>
        <section className="surface-card rounded-2xl border border-dashed border-slate-300/70 bg-slate-50/80 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Developer lab
          </p>
          <p className="mt-2">
            The original end-to-end integration console is available at{" "}
            <Link
              href="/lab"
              className="font-semibold text-emerald-700 underline dark:text-emerald-300"
            >
              /lab
            </Link>{" "}
            for direct API testing.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Configure backend base URL through{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
              NEXT_PUBLIC_BACKEND_API_BASE
            </code>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
