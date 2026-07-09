"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  { href: "/farmer", label: "Home" },
  { href: "/farmer/farms", label: "Farms" },
  { href: "/farmer/farms/new", label: "Add farm" },
  { href: "/farmer/insights", label: "AI insights" },
  { href: "/farmer/proof", label: "Proof" },
  { href: "/farmer/insurance", label: "Insurance" },
  { href: "/farmer/credit", label: "Credit score" },
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
    id: "f-insurance",
    group: "navigation",
    label: "Insurance",
    href: "/farmer/insurance",
    description: "Parametric insurance claims",
    keywords: ["claim", "cover"],
    aliases: ["claims", "payout", "crop insurance"],
  },
  {
    id: "f-credit",
    group: "navigation",
    label: "Credit score",
    href: "/farmer/credit",
    description: "Farm credit profile for lenders",
    keywords: ["loan", "score", "bank"],
    aliases: ["loan eligibility", "financing", "credit profile"],
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useNavigationShortcuts({
    slash: () => setPaletteOpen(true),
    openPalette: () => setPaletteOpen(true),
    gF: () => router.push("/farmer/farms"),
    gA: () => router.push("/farmer/insights"),
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/farmer/login");
      return;
    }
    if (user.role === "admin" || user.role === "agronomist") {
      router.replace("/admin");
    } else if (user.role !== "farmer") {
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
        <BackendStatusBanner />
        <header className="surface-card rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <AppBrand subtitle={`Farmer workspace · ${user.name}`} />
              <p className="mt-2 hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Shortcuts: <kbd>/</kbd> or <kbd>Ctrl/⌘</kbd>+<kbd>K</kbd> palette ·{" "}
                <kbd>g</kbd>+<kbd>f</kbd> farms · <kbd>g</kbd>+<kbd>a</kbd> insights
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
              <button
                type="button"
                className={buttonClasses({ variant: "secondary", size: "sm" })}
                onClick={() => setPaletteOpen(true)}
              >
                Search
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
          <aside className="hidden lg:block lg:w-64 lg:shrink-0">
            <div className="surface-card sticky top-5 rounded-2xl border border-emerald-100 bg-white/90 p-3 dark:border-emerald-900/40 dark:bg-slate-900/80">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                Navigation
              </p>
              <SidebarNav links={links} pathname={pathname} variant="farmer" />
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
        variant="farmer"
      />
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
