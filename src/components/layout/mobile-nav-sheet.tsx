"use client";

import { SidebarNav, type NavLink } from "@/components/layout/sidebar-nav";

type MobileNavSheetProps = {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  pathname: string;
  variant: "farmer" | "admin";
};

export function MobileNavSheet({
  open,
  onClose,
  links,
  pathname,
  variant,
}: MobileNavSheetProps) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900 lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Menu
          </p>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <SidebarNav
          links={links}
          pathname={pathname}
          variant={variant}
          onNavigate={onClose}
        />
      </div>
    </>
  );
}
