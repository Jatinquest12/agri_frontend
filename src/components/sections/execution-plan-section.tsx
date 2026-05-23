import type { ExecutionPhase } from "@/types/agrisentinel";

type ExecutionPlanSectionProps = {
  phases: ExecutionPhase[];
};

export function ExecutionPlanSection({ phases }: ExecutionPlanSectionProps) {
  return (
    <section
      id="execution"
      className="scroll-mt-28 rounded-2xl border border-green-100 bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
        Execution Plan
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {phases.map((phase, index) => (
          <div
            key={phase.title}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Phase {index + 1}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {phase.title}
            </p>
            <p className="mt-1 text-sm text-slate-600">{phase.duration}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
