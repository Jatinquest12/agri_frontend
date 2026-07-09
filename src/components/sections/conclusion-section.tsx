"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { brand } from "@/data/site-content";

type ConclusionSectionProps = {
  highlights: string[];
};

export function ConclusionSection({ highlights }: ConclusionSectionProps) {
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
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="relative overflow-hidden scroll-mt-32 rounded-[3rem] bg-[#1B4332] p-8 shadow-2xl md:p-12 lg:p-16"
    >
      <div className="absolute -right-20 -top-20 z-0 h-96 w-96 rounded-full bg-white/5 blur-[80px]" />
      <div className="absolute -bottom-20 -left-20 z-0 h-96 w-96 rounded-full bg-[#2E7D32]/10 blur-[80px]" />
      
      <div className="relative z-10">
        <h2 id="outcomes-heading" className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          Outcomes you can measure
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#A5D6A7]/90 md:text-xl">
          <span className="font-semibold text-white">{brand.name}</span> turns farm data into trusted signals for insurance, credit, and
          supply-chain partners—without replacing your existing backend investments.
        </p>
        <motion.ul 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid gap-4 md:grid-cols-2"
        >
          {highlights.map((highlight) => (
            <motion.li
              variants={item}
              key={highlight}
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 text-base font-medium leading-relaxed text-white backdrop-blur-md border border-white/10 transition-colors hover:bg-white/20"
            >
              <CheckCircle className="h-5 w-5 shrink-0 text-[#A5D6A7]" />
              <span>{highlight}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/farmer/login"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-bold text-[#1B4332] shadow-xl transition-all hover:scale-105 hover:bg-[#F8FAF5]"
          >
            Get started as a farmer
          </Link>
          <Link
            href="/lab"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-[#A5D6A7]/30 bg-transparent px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Open developer lab
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
