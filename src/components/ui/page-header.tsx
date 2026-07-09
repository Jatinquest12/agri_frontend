"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-slate-200/80 bg-white/60 px-6 py-8 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60 sm:px-8"
    >
      {/* Decorative gradients */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2E7D32] via-[#1B4332] to-[#2E7D32] opacity-70" />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#E8F5E9]/50 blur-3xl transition-opacity duration-700 group-hover:opacity-80 dark:bg-[#1B4332]/30" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl transition-opacity duration-700 group-hover:opacity-80 dark:bg-blue-900/20" />

      <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          {breadcrumbs?.length ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-4"
            >
              <Breadcrumb items={breadcrumbs} />
            </motion.div>
          ) : null}
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            {title}
          </motion.h1>
          {description ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mt-2 text-base font-medium text-slate-500 dark:text-slate-400 sm:text-lg"
            >
              {description}
            </motion.p>
          ) : null}
        </div>
        {actions ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex shrink-0 items-center justify-center pt-2 sm:pt-0"
          >
            {actions}
          </motion.div>
        ) : null}
      </div>
    </motion.header>
  );
}
