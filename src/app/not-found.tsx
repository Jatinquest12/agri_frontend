import Link from "next/link";

import { brand } from "@/data/site-content";

export default function NotFound() {
  return (
    <div className="app-backdrop flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
        {brand.name}
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-slate-50">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
        The page you requested does not exist or may have moved. Use the links below
        to continue.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Home
        </Link>
        <Link
          href="/farmer/login"
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
        >
          Farmer sign in
        </Link>
        <Link
          href="/verify"
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
        >
          Verify proof
        </Link>
      </div>
    </div>
  );
}
