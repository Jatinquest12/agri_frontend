import type { ReactNode } from "react";

function cx(...items: Array<string | false | null | undefined>): string {
  return items.filter(Boolean).join(" ");
}

export function DataTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={cx("w-full min-w-[560px] text-left text-sm", className)}>
        {children}
      </table>
    </div>
  );
}

export function HeadRow({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
      {children}
    </tr>
  );
}

export function BodyRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={`border-b border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-emerald-50/60 dark:border-slate-800 dark:odd:bg-slate-900/20 dark:even:bg-slate-900/40 dark:hover:bg-emerald-950/20 ${className ?? ""}`}
    >
      {children}
    </tr>
  );
}

export function TH({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={cx("py-3 pr-3 text-xs font-semibold uppercase tracking-wide", className)}>
      {children}
    </th>
  );
}

export function TD({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={cx("py-3 pr-3 text-slate-700 dark:text-slate-200", className)}>{children}</td>;
}
