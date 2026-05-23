"use client";

type Point = { label: string; value: number };

export function SimpleLineChart({
  data,
  height = 120,
  color = "#059669",
}: {
  data: Point[];
  height?: number;
  color?: string;
}) {
  if (data.length === 0) return null;
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = 8;
  const w = 320;
  const h = height;
  const norm = (v: number) =>
    max === min ? 0.5 : (v - min) / (max - min);
  const pts = data.map((d, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - norm(d.value) * (h - pad * 2);
    return `${x},${y}`;
  });
  const d = `M ${pts.join(" L ")}`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full max-w-md"
        role="img"
        aria-label="Trend chart"
      >
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill="transparent"
        />
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {data.map((p, i) => {
          const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
          const y = h - pad - norm(p.value) * (h - pad * 2);
          return <circle key={p.label} cx={x} cy={y} r="3" fill={color} />;
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
        {data.map((p) => (
          <span key={p.label}>
            {p.label}: <strong className="text-slate-800 dark:text-slate-200">{p.value}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}
