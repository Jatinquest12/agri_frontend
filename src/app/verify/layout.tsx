import type { Metadata } from "next";
import Link from "next/link";

import { AppBrand } from "@/components/layout/app-brand";
import { brand } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Public verification",
  description: `Verify farm proof hashes and QR payloads with ${brand.name}.`,
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-backdrop flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-950">
      <header className="border-b border-slate-200/90 bg-white/90 px-4 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <AppBrand subtitle="Public verification portal" />
          <Link
            href="/"
            className="text-xs font-semibold text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300"
          >
            Home
          </Link>
        </div>
      </header>
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</div>
    </div>
  );
}
