"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/context/auth-context";
import { useNavigationShortcuts } from "@/hooks/use-navigation-shortcuts";
import { AppBrand } from "@/components/layout/app-brand";
import { BackendStatusBanner } from "@/components/layout/backend-status-banner";
import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { buttonClasses } from "@/components/ui/button";
import { CommandPalette, type CommandItem } from "@/components/ui/command-palette";
import { LoadingState, SkeletonCard } from "@/components/ui/states";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/farmers", label: "Farmer approvals" },
  { href: "/admin/farms", label: "Farm approvals" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/roles", label: "Roles" },
  { href: "/admin/ai", label: "AI monitoring" },
  { href: "/admin/verification", label: "Verification" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/marketplace", label: "Marketplace" },
];

const commands: CommandItem[] = [
  {
    id: "a-overview",
    group: "navigation",
    label: "Overview",
    href: "/admin",
    description: "Admin dashboard",
    keywords: ["home", "operations"],
    aliases: ["dashboard", "console", "summary"],
  },
  {
    id: "a-farmers",
    group: "navigation",
    label: "Farmer approvals",
    href: "/admin/farmers",
    description: "KYC and onboarding approvals",
    keywords: ["kyc", "farmers"],
    aliases: ["kyc", "onboard", "onboarding", "farmer kyc", "vetting"],
  },
  {
    id: "a-farms",
    group: "navigation",
    label: "Farm approvals",
    href: "/admin/farms",
    description: "Review farm submissions",
    keywords: ["farm", "approval"],
    aliases: ["submissions", "pending farms", "review farms"],
  },
  {
    id: "a-users",
    group: "navigation",
    label: "Users",
    href: "/admin/users",
    description: "User directory",
    keywords: ["people"],
    aliases: ["directory", "accounts", "staff"],
  },
  {
    id: "a-roles",
    group: "navigation",
    label: "Roles",
    href: "/admin/roles",
    description: "Role and permission matrix",
    keywords: ["permission", "rbac"],
    aliases: ["rbac", "permissions", "acl", "access"],
  },
  {
    id: "a-ai",
    group: "navigation",
    label: "AI monitoring",
    href: "/admin/ai",
    description: "AI jobs and confidence review",
    keywords: ["job", "confidence"],
    aliases: ["models", "inference", "ml ops"],
  },
  {
    id: "a-verification",
    group: "navigation",
    label: "Verification",
    href: "/admin/verification",
    description: "Proof and audit tools",
    keywords: ["audit", "proof"],
    aliases: ["audit", "attestation", "chain of custody"],
  },
  {
    id: "a-analytics",
    group: "navigation",
    label: "Analytics",
    href: "/admin/analytics",
    description: "Platform analytics",
    keywords: ["report", "metrics"],
    aliases: ["reports", "charts", "kpi", "usage"],
  },
  {
    id: "a-marketplace",
    group: "navigation",
    label: "Marketplace",
    href: "/admin/marketplace",
    description: "Commodity tokens & HTLC transfers",
    keywords: ["token", "trade", "htlc"],
    aliases: ["tokens", "commodity", "trade", "supply chain"],
  },
  {
    id: "a-signout",
    group: "actions",
    label: "Sign out",
    description: "End your session",
    keywords: ["logout", "exit", "leave"],
    aliases: ["sign off", "log out"],
    action: "logout",
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useNavigationShortcuts({
    slash: () => setPaletteOpen(true),
    openPalette: () => setPaletteOpen(true),
    gF: () => router.push("/admin/farms"),
    gA: () => router.push("/admin/analytics"),
  });

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "agronomist"))) {
      router.replace("/");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="app-backdrop min-h-screen bg-slate-50 px-4 py-6 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl space-y-4">
          <LoadingState label="Preparing admin console..." />
          <div className="grid gap-4 md:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "agronomist")) {
    return null;
  }

  return (
    <div className="app-backdrop min-h-screen bg-gradient-to-b from-slate-100/80 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 lg:px-8">
        <BackendStatusBanner />
        <header className="surface-card rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <AppBrand subtitle={`Admin console · ${user.name} (${user.role})`} />
              <p className="mt-2 hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Shortcuts: <kbd>/</kbd> or <kbd>Ctrl/⌘</kbd>+<kbd>K</kbd> palette ·{" "}
                <kbd>g</kbd>+<kbd>f</kbd> farms · <kbd>g</kbd>+<kbd>a</kbd> analytics
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                onClick={() => setMobileNavOpen(true)}
                aria-expanded={mobileNavOpen}
              >
                Menu
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="group flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm transition-all hover:border-emerald-300 hover:bg-slate-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                onClick={() => setPaletteOpen(true)}
              >
                <Search className="h-4 w-4 text-slate-400 transition-colors group-hover:text-emerald-500 dark:text-slate-500 dark:group-hover:text-emerald-400" />
                <span>Search</span>
                <div className="ml-2 hidden items-center gap-0.5 sm:flex">
                  <kbd className="flex h-5 items-center justify-center rounded border border-slate-200 bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500 transition-colors group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:border-emerald-800 dark:group-hover:bg-emerald-900/50 dark:group-hover:text-emerald-400">
                    ⌘
                  </kbd>
                  <kbd className="flex h-5 items-center justify-center rounded border border-slate-200 bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500 transition-colors group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:border-emerald-800 dark:group-hover:bg-emerald-900/50 dark:group-hover:text-emerald-400">
                    K
                  </kbd>
                </div>
              </motion.button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                onClick={() => {
                  void logout().then(() => router.push("/"));
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="hidden lg:block lg:w-64 lg:shrink-0">
            <div className="surface-card sticky top-5 rounded-2xl border border-slate-200/90 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-900/80">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Navigation
              </p>
              <SidebarNav links={links} pathname={pathname} variant="admin" />
            </div>
          </aside>
          <main className="min-w-0 flex-1 space-y-6 pb-20 lg:pb-8">{children}</main>
        </div>
      </div>
      <MobileNavSheet
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={links}
        pathname={pathname}
        variant="admin"
      />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={commands}
        recentStorageKey="agritrust_palette_recent_admin"
        onLogout={() => {
          void logout().then(() => router.push("/"));
        }}
      />
    </div>
  );
}
