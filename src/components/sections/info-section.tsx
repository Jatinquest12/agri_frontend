import type { InfoSectionContent } from "@/types/agrisentinel";

type InfoSectionProps = InfoSectionContent;

export function InfoSection({
  id,
  title,
  subtitle,
  points,
  columns = 2,
}: InfoSectionProps) {
  const columnClass =
    columns === 3
      ? "md:grid-cols-3"
      : columns === 1
        ? "md:grid-cols-1"
        : "md:grid-cols-2";

  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-2xl border border-green-100 bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-sm text-slate-600 md:text-base">{subtitle}</p>
      ) : null}
      <ul className={`mt-6 grid gap-3 ${columnClass}`}>
        {points.map((point) => (
          <li
            key={point}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700"
          >
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
