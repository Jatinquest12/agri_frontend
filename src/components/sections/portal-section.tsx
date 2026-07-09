"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PortalCard } from "@/types/site-content";

type PortalSectionProps = {
  portals: PortalCard[];
};

export function PortalSection({ portals }: PortalSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      id="access"
      aria-labelledby="access-heading"
      className="scroll-mt-32"
    >
      <div className="mb-10 text-center md:text-left">
        <h2
          id="access-heading"
          className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl text-gradient-brand"
        >
          Platform access
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Choose the workspace that matches your role. Each portal shares the same
          farm registry and proof APIs.
        </p>
      </div>
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-3"
      >
        {portals.map((portal) => (
          <motion.article
            variants={item}
            key={portal.href}
            className="glass-panel group flex flex-col rounded-[2rem] p-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#1B4332]/10"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#2E7D32]/80 transition-colors group-hover:text-[#1B4332]">
              {portal.audience}
            </p>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              {portal.title}
            </h3>
            <p className="mt-3 flex-1 text-base leading-relaxed text-slate-600">
              {portal.description}
            </p>
            <Link
              href={portal.href}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-sm font-bold text-[#1B4332] transition-all group-hover:bg-[#2E7D32] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#2E7D32]/30"
            >
              {portal.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}
