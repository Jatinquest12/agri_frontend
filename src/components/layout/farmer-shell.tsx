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
  { href: "/farmer", label: "Home" },
  { href: "/farmer/farms", label: "Farms" },
  { href: "/farmer/farms/new", label: "Add farm" },
  { href: "/farmer/insights", label: "AI insights" },
  { href: "/farmer/proof", label: "Proof" },
  { href: "/farmer/notifications", label: "Notifications" },
  { href: "/farmer/profile", label: "Profile" },
];

const commands: CommandItem[] = [
  {
    id: "f-home",
    group: "navigation",
    label: "Home",
    href: "/farmer",
    description: "Farmer dashboard",
    keywords: ["dashboard"],
    aliases: ["hub", "main", "start"],
  },
  {
    id: "f-farms",
    group: "navigation",
    label: "Farms",
    href: "/farmer/farms",
    description: "Farm list",
    keywords: ["farm", "list"],
    aliases: ["plots", "land", "parcels"],
  },
  {
    id: "f-add-farm",
    group: "navigation",
    label: "Add farm",
    href: "/farmer/farms/new",
    description: "Register a new farm",
    keywords: ["new", "register"],
    aliases: ["create farm", "new farm", "enroll"],
  },
  {
    id: "f-insights",
    group: "navigation",
    label: "AI insights",
    href: "/farmer/insights",
    description: "Crop health and alerts",
    keywords: ["ai", "analytics"],
    aliases: ["crops", "health", "predictions", "ml"],
  },
  {
    id: "f-proof",
    group: "navigation",
    label: "Proof",
    href: "/farmer/proof",
    description: "Proof and certificate",
    keywords: ["verify", "certificate"],
    aliases: ["qr", "attest", "credentials"],
  },
  {
    id: "f-notifications",
    group: "navigation",
    label: "Notifications",
    href: "/farmer/notifications",
    description: "Alerts and messages",
    keywords: ["alert", "inbox"],
    aliases: ["messages", "bell"],
  },
  {
    id: "f-profile",
    group: "navigation",
    label: "Profile",
    href: "/farmer/profile",
    description: "Account profile",
    keywords: ["account"],
    aliases: ["me", "settings", "user"],
  },
  {
    id: "f-signout",
    group: "actions",
    label: "Sign out",
    description: "End your session",
    keywords: ["logout", "exit", "leave"],
    aliases: ["sign off", "log out"],
    action: "logout",
  },
];

export function FarmerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useNavigationShortcuts({
    slash: () => setPaletteOpen(true),
    openPalette: () => setPaletteOpen(true),
    gF: () => router.push("/farmer/farms"),
    gA: () => router.push("/farmer/insights"),
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "farmer")) {
      router.replace("/farmer/login");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="app-backdrop min-h-screen bg-emerald-50/40 px-4 py-6 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl space-y-4">
          <LoadingState label="Preparing farmer workspace..." />
          <div className="grid gap-4 md:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "farmer") {
    return null;
  }

  return (
    <div className="app-backdrop min-h-screen bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 md:px-6">
        <header className="surface-card rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                Farmer Workspace
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Welcome back, {user.name}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Shortcuts: <kbd>/</kbd> or <kbd>Ctrl/⌘</kbd>+<kbd>K</kbd> command
                palette, <kbd>g</kbd> then <kbd>f</kbd> farms, <kbd>g</kbd> then{" "}
                <kbd>a</kbd> AI insights
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
                  void logout().then(() => router.push("/farmer/login"));
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64 lg:shrink-0">
            <div className="surface-card sticky top-5 rounded-2xl border border-emerald-100 bg-white/90 p-3 dark:border-emerald-900/40 dark:bg-slate-900/80">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                Navigation
              </p>
              <nav className="flex flex-col gap-1 text-sm">
                {links.map((l) => {
                  const active =
                    l.href === "/farmer"
                      ? pathname === "/farmer"
                      : pathname.startsWith(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`rounded-xl px-3 py-2 ${
                        active
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-800"
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
        recentStorageKey="agritrust_palette_recent_farmer"
        onLogout={() => {
          void logout().then(() => router.push("/farmer/login"));
        }}
      />
    </div>
  );
}
