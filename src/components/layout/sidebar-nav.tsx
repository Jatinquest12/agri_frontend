"use client";

import Link from "next/link";

export type NavLink = {
  href: string;
  label: string;
};

type SidebarNavProps = {
  links: NavLink[];
  pathname: string;
  variant: "farmer" | "admin";
  onNavigate?: () => void;
};

export function SidebarNav({
  links,
  pathname,
  variant,
  onNavigate,
}: SidebarNavProps) {
  const activeClass =
    variant === "farmer"
      ? "bg-emerald-600 text-white shadow-sm"
      : "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900";
  const idleClass =
    variant === "farmer"
      ? "text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-800"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

  return (
    <nav className="flex flex-col gap-1 text-sm" aria-label="Main">
      {links.map((l) => {
        const active =
          l.href === "/farmer" || l.href === "/admin"
            ? pathname === l.href
            : pathname === l.href || pathname.startsWith(`${l.href}/`);

        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              active ? activeClass : idleClass
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
