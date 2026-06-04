import type { InfoSectionContent } from "@/types/site-content";

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
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-28 surface-card rounded-2xl border border-slate-200/80 bg-white/90 p-6 md:p-8 dark:border-slate-800 dark:bg-slate-900/80"
    >
      <h2
        id={`${id}-heading`}
        className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
          {subtitle}
        </p>
      ) : null}
      <ul className={`mt-6 grid gap-3 ${columnClass}`}>
        {points.map((point) => (
          <li
            key={point}
            className="rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3.5 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300"
          >
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
