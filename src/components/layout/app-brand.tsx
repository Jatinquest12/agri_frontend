import Link from "next/link";
import { Leaf } from "lucide-react";

import { brand } from "@/data/site-content";

type AppBrandProps = {
  subtitle: string;
  href?: string;
};

export function AppBrand({ subtitle, href = "/" }: AppBrandProps) {
  return (
    <Link href={href} className="group flex items-center gap-3 min-w-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8F5E9] to-[#F8FAF5] text-[#2E7D32] shadow-sm transition-transform group-hover:scale-105 dark:from-emerald-900/50 dark:to-emerald-950 dark:text-emerald-300">
        <Leaf className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2E7D32] transition-colors group-hover:text-[#1B4332] dark:text-emerald-400 dark:group-hover:text-emerald-300">
          {brand.name}
        </p>
        <p className="mt-0.5 truncate text-base font-semibold tracking-tight text-slate-800 transition-colors group-hover:text-slate-950 dark:text-slate-200 dark:group-hover:text-white">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
