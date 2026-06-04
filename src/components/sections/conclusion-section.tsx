import Link from "next/link";

import { brand } from "@/data/site-content";

type ConclusionSectionProps = {
  highlights: string[];
};

export function ConclusionSection({ highlights }: ConclusionSectionProps) {
  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="scroll-mt-28 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-emerald-50 shadow-lg md:p-8"
    >
      <h2 id="outcomes-heading" className="text-2xl font-semibold tracking-tight">
        Outcomes you can measure
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed md:text-base text-emerald-100/90">
        {brand.name} turns farm data into trusted signals for insurance, credit, and
        supply-chain partners—without replacing your existing backend investments.
      </p>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {highlights.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-emerald-600/40 bg-emerald-900/40 px-4 py-3 text-sm leading-relaxed"
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/farmer/login"
          className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
        >
          Get started as a farmer
        </Link>
        <Link
          href="/lab"
          className="rounded-xl border border-emerald-400/50 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800/60"
        >
          Open developer lab
        </Link>
      </div>
    </section>
  );
}
