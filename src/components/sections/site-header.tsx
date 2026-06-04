import Link from "next/link";

import { brand } from "@/data/site-content";
import type { NavItem } from "@/types/site-content";

type SiteHeaderProps = {
  navItems: NavItem[];
};

export function SiteHeader({ navItems }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 md:px-8">
        <Link href="/" className="group min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            {brand.name}
          </p>
          <p className="truncate text-sm text-slate-600 transition group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200">
            {brand.tagline}
          </p>
        </Link>
        <nav
          className="flex flex-wrap items-center gap-2 text-xs md:text-sm"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-100"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/farmer/login"
            className="rounded-full bg-emerald-600 px-3.5 py-1.5 font-semibold text-white transition hover:bg-emerald-700"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
