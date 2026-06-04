"use client";

export type LulcBar = {
  label: string;
  percent: number;
  area_sqkm: number;
};

export function LulcBarChart({
  data,
  height = 160,
}: {
  data: LulcBar[];
  height?: number;
}) {
  if (data.length === 0) return null;

  const top = data.slice(0, 8);
  const max = Math.max(...top.map((d) => d.percent), 1);

  return (
    <div className="space-y-2" style={{ minHeight: height }}>
      {top.map((row) => (
        <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs">
          <div>
            <div className="mb-1 flex justify-between gap-2 text-slate-600 dark:text-slate-400">
              <span className="truncate">{row.label}</span>
              <span className="shrink-0 tabular-nums text-slate-800 dark:text-slate-200">
                {row.percent.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-600"
                style={{ width: `${(row.percent / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="tabular-nums text-[10px] text-slate-500">
            {row.area_sqkm.toFixed(1)} km²
          </span>
        </div>
      ))}
    </div>
  );
}
