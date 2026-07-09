"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Database, Zap, Search } from "lucide-react";

import type { HeroContent } from "@/types/site-content";

type HeroSectionProps = {
  content: HeroContent;
};

// Map benefit strings to icons for a more premium look
const benefitIcons = [Database, Search, ShieldCheck, Zap];

export function HeroSection({ content }: HeroSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex flex-col items-center justify-center pt-40 pb-12 text-center"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex max-w-4xl flex-col items-center gap-6"
      >
        <motion.p 
          variants={item}
          className="rounded-full bg-[#E8F5E9] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#2E7D32] ring-1 ring-[#DDEFD8]/50"
        >
          {content.eyebrow}
        </motion.p>
        
        <motion.h1
          variants={item}
          id="hero-heading"
          className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl lg:leading-[1.1] text-[#1B4332]"
        >
          {content.title}
        </motion.h1>
        
        <motion.p 
          variants={item}
          className="max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl"
        >
          {content.description}
        </motion.p>
        
        <motion.div variants={item} className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={content.primaryCta.href}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#2E7D32] px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-[#2E7D32]/40 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
          >
            <span className="relative z-10">{content.primaryCta.label}</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-[#2E7D32] to-[#2E7D32] opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <Link
            href={content.secondaryCta.href}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 transition hover:border-[#DDEFD8] hover:bg-[#E8F5E9] hover:text-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
          >
            {content.secondaryCta.label}
          </Link>
        </motion.div>
      </motion.div>

      <motion.ul 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-20 grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {content.benefits.map((benefit, index) => {
          const Icon = benefitIcons[index % benefitIcons.length];
          return (
            <motion.li
              variants={item}
              key={benefit}
              className="glass-panel group relative flex flex-col items-center gap-3 rounded-2xl p-6 text-center transition-transform hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F5E9]/50 text-[#2E7D32] transition-colors group-hover:bg-[#E8F5E9]">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold leading-snug text-slate-800">
                {benefit}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
