import type { FeatureCard } from "@/types/site-content";

const iconLabels: Record<FeatureCard["icon"], string> = {
  registry: "01",
  monitoring: "02",
  proof: "03",
  verify: "04",
};

type FeaturesSectionProps = {
  features: FeatureCard[];
};

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-28"
    >
      <div className="mb-6">
        <h2
          id="features-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          Core capabilities
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Everything you need to run a credible farm-trust pilot—from registry to
          public verification.
        </p>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="surface-card card-motion rounded-2xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900/80"
          >
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white"
            >
              {iconLabels[feature.icon]}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
