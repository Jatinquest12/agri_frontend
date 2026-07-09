"use client";

import Link from "next/link";

export type NavLink = {
  href: string;
  label: string;
  icon?: React.ElementType;
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
      ? "bg-[#E8F5E9] text-[#1B4332] shadow-[inset_4px_0_0_0_#2E7D32] dark:bg-emerald-900/30 dark:text-emerald-100"
      : "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900";
  const idleClass =
    variant === "farmer"
      ? "text-slate-600 hover:bg-[#E8F5E9]/60 hover:text-[#1B4332] dark:text-slate-300 dark:hover:bg-slate-800"
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
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              active ? activeClass : idleClass
            }`}
          >
            {l.icon && (
              <l.icon 
                className={`h-[18px] w-[18px] transition-colors ${active ? "text-[#2E7D32] dark:text-emerald-300" : "text-slate-400 group-hover:text-[#2E7D32] dark:text-slate-500 dark:group-hover:text-[#2E7D32]"}`} 
              />
            )}
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
