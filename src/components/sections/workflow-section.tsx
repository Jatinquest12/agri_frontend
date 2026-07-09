"use client";

import { motion } from "framer-motion";

type WorkflowSectionProps = {
  steps: string[];
};

export function WorkflowSection({ steps }: WorkflowSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      id="workflow"
      aria-labelledby="workflow-heading"
      className="scroll-mt-32 glass-panel relative overflow-hidden rounded-[2.5rem] p-8 md:p-12"
    >
      <div className="absolute right-0 top-0 z-0 h-96 w-96 rounded-full bg-[#2E7D32]/5 blur-[100px]" />
      
      <div className="relative z-10">
        <h2
          id="workflow-heading"
          className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
        >
          How it works
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          End-to-end flow from farm registration to public verification.
        </p>
        <motion.ol 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid gap-4 md:grid-cols-2"
        >
          {steps.map((step, index) => (
            <motion.li
              variants={item}
              key={step}
              className="group flex items-start gap-4 rounded-2xl bg-white/60 p-5 shadow-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-sm font-bold text-[#2E7D32] transition-colors group-hover:bg-[#1B4332] group-hover:text-white"
              >
                {index + 1}
              </span>
              <span className="text-base font-medium leading-relaxed text-slate-800">{step}</span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </motion.section>
  );
}
