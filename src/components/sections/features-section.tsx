"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Target, Link as LinkIcon, ShieldCheck } from "lucide-react";
import type { FeatureCard } from "@/types/site-content";

// Map keys to specific premium icons
const iconMap: Record<FeatureCard["icon"], React.ElementType> = {
  registry: LayoutDashboard,
  monitoring: Target,
  proof: LinkIcon,
  verify: ShieldCheck,
};

type FeaturesSectionProps = {
  features: FeatureCard[];
};

export function FeaturesSection({ features }: FeaturesSectionProps) {
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
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-32">
      <div className="mb-10 max-w-2xl text-center md:text-left">
        <h2
          id="features-heading"
          className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl text-gradient-brand"
        >
          Core capabilities
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          Everything you need to run a credible farm-trust pilot—from registry to
          public verification. Built for scale and integrity.
        </p>
      </div>
      
      <motion.ul 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
      >
        {features.map((feature, idx) => {
          const IconComponent = iconMap[feature.icon];
          // Determine spanning for bento layout
          const isLarge = idx === 0 || idx === 3;
          
          return (
            <motion.li
              variants={item}
              key={feature.title}
              className={`bg-white border border-[#DDEFD8] group relative overflow-hidden rounded-3xl p-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#DDEFD8]/50 ${isLarge ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="absolute -right-10 -top-10 z-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition-all group-hover:bg-emerald-500/20" />
              
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/60 shadow-inner">
                <IconComponent className="h-7 w-7 text-[#2E7D32] transition-transform group-hover:scale-110" />
              </div>
              
              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
