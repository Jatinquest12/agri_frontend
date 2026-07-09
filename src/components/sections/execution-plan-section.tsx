"use client";

import { motion } from "framer-motion";
import type { ExecutionPhase } from "@/types/site-content";

type ExecutionPlanSectionProps = {
  phases: ExecutionPhase[];
};

export function ExecutionPlanSection({ phases }: ExecutionPlanSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 70 } },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      id="roadmap"
      aria-labelledby="roadmap-heading"
      className="scroll-mt-32 glass-panel relative overflow-hidden rounded-[2.5rem] p-8 md:p-12"
    >
      <div className="absolute -left-10 bottom-0 z-0 h-80 w-80 rounded-full bg-[#2E7D32]/5 blur-[90px]" />
      
      <div className="relative z-10">
        <h2
          id="roadmap-heading"
          className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
        >
          Implementation roadmap
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          A practical sequence aligned with the Agritrust frontend implementation plan.
        </p>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid gap-4 md:grid-cols-2"
        >
          {phases.map((phase, index) => (
            <motion.div
              variants={item}
              key={phase.title}
              className="group rounded-2xl bg-white/60 p-6 shadow-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#2E7D32]/80 group-hover:text-[#1B4332] transition-colors">
                {phase.duration}
              </p>
              <p className="mt-3 text-lg font-bold text-slate-900">
                {phase.title}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] group-hover:bg-[#d97706] transition-colors" />
                <p className="text-xs font-medium text-slate-500">Milestone {index + 1}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
