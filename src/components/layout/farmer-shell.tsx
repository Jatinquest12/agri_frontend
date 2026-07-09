"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Home, Map, PlusCircle, Sparkles, ShieldCheck, Bell, User, Search, LogOut } from "lucide-react";
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
  { href: "/farmer", label: "Home", icon: Home },
  { href: "/farmer/farms", label: "Farms", icon: Map },
  { href: "/farmer/farms/new", label: "Add farm", icon: PlusCircle },
  { href: "/farmer/insights", label: "AI insights", icon: Sparkles },
  { href: "/farmer/proof", label: "Proof", icon: ShieldCheck },
  { href: "/farmer/notifications", label: "Notifications", icon: Bell },
  { href: "/farmer/profile", label: "Profile", icon: User },
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
    <div className="app-backdrop min-h-screen bg-[#F8FAF5]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 md:px-6">
        <BackendStatusBanner />
        <header className="surface-card relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2E7D32] via-[#1B4332] to-[#2E7D32] opacity-50" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <AppBrand subtitle={`Farmer workspace · ${user.name}`} />
              <div className="mt-3 hidden items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:flex">
                <span>Shortcuts:</span>
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">/</kbd>
                <span>or</span>
                <span className="flex items-center gap-0.5">
                  <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Ctrl/⌘</kbd>
                  <span>+</span>
                  <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">K</kbd>
                </span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="flex items-center gap-0.5">
                  <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">g</kbd>
                  <span>+</span>
                  <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">f</kbd>
                </span>
                <span>farms</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="flex items-center gap-0.5">
                  <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">g</kbd>
                  <span>+</span>
                  <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">a</kbd>
                </span>
                <span>insights</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
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
                className="group flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm transition-all hover:border-[#DDEFD8] hover:bg-slate-50 hover:text-[#2E7D32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
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
              <motion.button
                initial={{ boxShadow: "0px 4px 20px rgba(245,158,11,0.3)" }}
                animate={{ 
                  boxShadow: [
                    "0px 4px 20px rgba(245,158,11,0.3)", 
                    "0px 4px 35px rgba(245,158,11,0.7)", 
                    "0px 4px 20px rgba(245,158,11,0.3)"
                  ] 
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, backgroundColor: "#d97706" }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="group flex items-center gap-2 rounded-full border border-black/10 bg-[#F59E0B] px-5 py-2.5 text-sm font-medium tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]"
                onClick={() => {
                  void logout().then(() => router.push("/"));
                }}
              >
                <LogOut className="h-4 w-4 opacity-90 transition-transform group-hover:-translate-x-0.5" />
                Sign out
              </motion.button>
            </div>
          </div>
        </header>
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="hidden lg:block lg:w-64 lg:shrink-0">
            <div className="surface-card sticky top-5 rounded-2xl border border-emerald-100 bg-white/90 p-3 dark:border-emerald-900/40 dark:bg-slate-900/80">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2E7D32] dark:text-emerald-300">
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
          void logout().then(() => router.push("/"));
        }}
      />
    </div>
  );
}
