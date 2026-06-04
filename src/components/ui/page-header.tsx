import type { ReactNode } from "react";

import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {breadcrumbs?.length ? (
          <div className="mb-2">
            <Breadcrumb items={breadcrumbs} />
          </div>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
