import Link from "next/link";

import type { HeroContent } from "@/types/site-content";

type HeroSectionProps = {
  content: HeroContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="surface-card card-motion rounded-3xl border border-slate-200/80 bg-white/90 p-7 md:p-10 dark:border-slate-800 dark:bg-slate-900/80"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
        {content.eyebrow}
      </p>
      <h1
        id="hero-heading"
        className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl md:leading-[1.1]"
      >
        {content.title}
      </h1>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
        {content.description}
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href={content.primaryCta.href}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {content.primaryCta.label}
        </Link>
        <Link
          href={content.secondaryCta.href}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {content.secondaryCta.label}
        </Link>
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {content.benefits.map((benefit) => (
          <li
            key={benefit}
            className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm font-medium leading-snug text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100"
          >
            {benefit}
          </li>
        ))}
      </ul>
    </section>
  );
}
