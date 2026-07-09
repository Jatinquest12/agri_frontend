"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { InfoSectionContent } from "@/types/site-content";

type InfoSectionProps = InfoSectionContent;

export function InfoSection({
  id,
  title,
  subtitle,
  points,
  columns = 2,
}: InfoSectionProps) {
  const columnClass =
    columns === 3
      ? "md:grid-cols-3"
      : columns === 1
        ? "md:grid-cols-1"
        : "md:grid-cols-2";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 70 } },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-32 glass-panel relative overflow-hidden rounded-[2.5rem] p-8 md:p-12"
    >
      <div className="absolute -left-20 -top-20 z-0 h-64 w-64 rounded-full bg-[#2E7D32]/5 blur-[80px]" />
      
      <div className="relative z-10">
        <h2
          id={`${id}-heading`}
          className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
            {subtitle}
          </p>
        ) : null}
        
        <motion.ul 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={`mt-10 grid gap-4 ${columnClass}`}
        >
          {points.map((point) => (
            <motion.li
              variants={item}
              key={point}
              className="group flex items-start gap-4 rounded-2xl bg-white/60 p-5 shadow-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <div className="mt-0.5 shrink-0 rounded-full bg-[#E8F5E9] p-1 text-[#2E7D32] transition-colors group-hover:bg-[#DDEFD8] group-hover:text-[#1B4332]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-base font-medium leading-relaxed text-slate-800">
                {point}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}
