"use client";

import { motion } from "framer-motion";

type TrustPillar = {
  title: string;
  description: string;
};

type TrustSectionProps = {
  pillars: readonly TrustPillar[];
};

export function TrustSection({ pillars }: TrustSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70 } },
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="trust-heading" 
      className="scroll-mt-28"
    >
      <div className="text-center md:text-left">
        <h2
          id="trust-heading"
          className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl text-gradient-brand"
        >
          Why teams choose Agritrust
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Built for pilots that must graduate to production—transparent architecture,
          clear portals, and verifiable data flows.
        </p>
      </div>
      <motion.ul 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {pillars.map((pillar) => (
          <motion.li
            variants={item}
            key={pillar.title}
            className="bg-white border border-[#DDEFD8] group rounded-3xl p-6 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#DDEFD8]/50"
          >
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2E7D32] transition-colors">
              {pillar.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {pillar.description}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
