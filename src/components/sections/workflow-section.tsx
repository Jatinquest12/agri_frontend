type WorkflowSectionProps = {
  steps: string[];
};

export function WorkflowSection({ steps }: WorkflowSectionProps) {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className="scroll-mt-28 surface-card rounded-2xl border border-slate-200/80 bg-white/90 p-6 md:p-8 dark:border-slate-800 dark:bg-slate-900/80"
    >
      <h2
        id="workflow-heading"
        className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
      >
        How it works
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        End-to-end flow from farm registration to public verification.
      </p>
      <ol className="mt-6 grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <li
            key={step}
            className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/90 p-4 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300"
          >
            <span
              aria-hidden
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white"
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
