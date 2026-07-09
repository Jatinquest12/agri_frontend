"use client";

import { motion } from "framer-motion";
import type { StatItem } from "@/types/site-content";

type StatsSectionProps = {
  items: StatItem[];
};

export function StatsSection({ items }: StatsSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      aria-label="Platform highlights" 
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 z-10 relative"
    >
      {items.map((item) => (
        <motion.div
          variants={itemAnim}
          key={item.label}
          className="glass-panel group relative overflow-hidden rounded-[2rem] p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Subtle background glow on hover */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#2E7D32]/0 to-[#2E7D32]/0 transition-colors duration-500 group-hover:from-[#2E7D32]/5 group-hover:to-transparent" />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <p className="text-sm font-bold uppercase tracking-widest text-[#2E7D32]/80">
              {item.label}
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              {item.value}
            </p>
            {item.detail ? (
              <p className="mt-3 text-sm font-medium text-slate-500">{item.detail}</p>
            ) : null}
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}
