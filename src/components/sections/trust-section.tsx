type TrustPillar = {
  title: string;
  description: string;
};

type TrustSectionProps = {
  pillars: readonly TrustPillar[];
};

export function TrustSection({ pillars }: TrustSectionProps) {
  return (
    <section aria-labelledby="trust-heading" className="scroll-mt-28">
      <h2
        id="trust-heading"
        className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
      >
        Why teams choose Agritrust
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
        Built for pilots that must graduate to production—transparent architecture,
        clear portals, and verifiable data flows.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => (
          <li
            key={pillar.title}
            className="surface-card rounded-2xl border border-slate-200/80 bg-white/90 p-5 dark:border-slate-800 dark:bg-slate-900/80"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {pillar.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {pillar.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
