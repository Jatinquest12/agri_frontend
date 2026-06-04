import Link from "next/link";

import { brand } from "@/data/site-content";

type AppBrandProps = {
  subtitle: string;
  href?: string;
};

export function AppBrand({ subtitle, href = "/" }: AppBrandProps) {
  return (
    <Link href={href} className="group min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 transition group-hover:text-emerald-800 dark:text-emerald-300 dark:group-hover:text-emerald-200">
        {brand.name}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium text-slate-700 transition group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-white">
        {subtitle}
      </p>
    </Link>
  );
}
