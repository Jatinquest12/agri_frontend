"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { useNavigationShortcuts } from "@/hooks/use-navigation-shortcuts";
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

  useNavigationShortcuts({
    slash: () => setPaletteOpen(true),
    openPalette: () => setPaletteOpen(true),
    gF: () => router.push("/admin/farms"),
    gA: () => router.push("/admin/analytics"),
  });

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "agronomist"))) {
      router.replace("/admin/login");
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
        <header className="surface-card rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Admin Console
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Signed in as {user.name} ({user.role})
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Shortcuts: <kbd>/</kbd> or <kbd>Ctrl/⌘</kbd>+<kbd>K</kbd> command
                palette, <kbd>g</kbd> then <kbd>f</kbd> farms, <kbd>g</kbd> then{" "}
                <kbd>a</kbd> analytics
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={buttonClasses({ variant: "secondary", size: "sm" })}
                onClick={() => setPaletteOpen(true)}
              >
                Palette
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                onClick={() => {
                  void logout().then(() => router.push("/admin/login"));
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64 lg:shrink-0">
            <div className="surface-card sticky top-5 rounded-2xl border border-slate-200/90 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-900/80">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Navigation
              </p>
              <nav className="flex flex-col gap-1 text-sm">
                {links.map((l) => {
                  const active =
                    l.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`rounded-xl px-3 py-2 ${
                        active
                          ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400`}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
          <main className="min-w-0 flex-1 space-y-6 pb-8">{children}</main>
        </div>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={commands}
        recentStorageKey="agritrust_palette_recent_admin"
        onLogout={() => {
          void logout().then(() => router.push("/admin/login"));
        }}
      />
    </div>
  );
}
