import type { ExecutionPhase } from "@/types/site-content";

type ExecutionPlanSectionProps = {
  phases: ExecutionPhase[];
};

export function ExecutionPlanSection({ phases }: ExecutionPlanSectionProps) {
  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-heading"
      className="scroll-mt-28 surface-card rounded-2xl border border-slate-200/80 bg-white/90 p-6 md:p-8 dark:border-slate-800 dark:bg-slate-900/80"
    >
      <h2
        id="roadmap-heading"
        className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
      >
        Implementation roadmap
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        A practical sequence aligned with the Agritrust frontend implementation plan.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {phases.map((phase, index) => (
          <div
            key={phase.title}
            className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-700 dark:bg-slate-950/50"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              {phase.duration}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              {phase.title}
            </p>
            <p className="mt-1 text-xs text-slate-500">Milestone {index + 1}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
