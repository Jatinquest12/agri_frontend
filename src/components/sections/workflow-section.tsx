type WorkflowSectionProps = {
  steps: string[];
};

export function WorkflowSection({ steps }: WorkflowSectionProps) {
  return (
    <section
      id="workflow"
      className="scroll-mt-28 rounded-2xl border border-green-100 bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
        System Workflow
      </h2>
      <ol className="mt-6 grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <li
            key={step}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700"
          >
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-700 text-xs font-semibold text-white">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
