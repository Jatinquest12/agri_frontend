import type { HeroContent } from "@/types/agrisentinel";

type HeroSectionProps = {
  content: HeroContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm md:p-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
        {content.eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
        {content.title}
      </h1>
      <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-700 md:text-base">
        {content.description}
      </p>
      <div className="mt-7 grid gap-4 md:grid-cols-4">
        {content.benefits.map((benefit) => (
          <div
            key={benefit}
            className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-900"
          >
            {benefit}
          </div>
        ))}
      </div>
    </section>
  );
}
