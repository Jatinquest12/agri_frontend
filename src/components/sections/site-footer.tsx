import Link from "next/link";

import { brand, footerLinks } from "@/data/site-content";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-8">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {brand.legalName}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {brand.tagline}. Built for pilots and production API integration.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Product
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {footerLinks.product.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-600 underline-offset-2 hover:text-emerald-700 hover:underline dark:text-slate-400 dark:hover:text-emerald-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Developers
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {footerLinks.developers.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-600 underline-offset-2 hover:text-emerald-700 hover:underline dark:text-slate-400 dark:hover:text-emerald-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Set{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">
              NEXT_PUBLIC_BACKEND_API_BASE
            </code>{" "}
            in <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">.env.local</code>.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200/80 px-4 py-4 text-center text-xs text-slate-500 dark:border-slate-800">
        © {year} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
