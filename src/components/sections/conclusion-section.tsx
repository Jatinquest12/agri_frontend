type ConclusionSectionProps = {
  highlights: string[];
};

export function ConclusionSection({ highlights }: ConclusionSectionProps) {
  return (
    <section
      id="conclusion"
      className="scroll-mt-28 rounded-2xl border border-green-200 bg-green-900 p-6 text-green-50 shadow-sm md:p-8"
    >
      <h2 className="text-2xl font-bold tracking-tight">Conclusion</h2>
      <p className="mt-4 text-sm leading-7 md:text-base">
        AgriSentinel transforms agriculture into a data-driven, transparent, and
        intelligent ecosystem by combining AI insights, blockchain trust, and
        digital infrastructure for insurance, credit, and produce traceability.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {highlights.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-green-700 bg-green-800/70 p-4"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
