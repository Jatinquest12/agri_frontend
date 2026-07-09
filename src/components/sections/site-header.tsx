"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

import { brand } from "@/data/site-content";
import type { NavItem } from "@/types/site-content";

type SiteHeaderProps = {
  navItems: NavItem[];
};

export function SiteHeader({ navItems }: SiteHeaderProps) {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 right-0 top-4 z-50 mx-auto w-full max-w-5xl px-4"
    >
      <div className="backdrop-blur-xl flex items-center justify-between rounded-full px-6 py-3 shadow-xl bg-[#2E7D32]">
        <Link href="/" className="group flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:scale-110">
            <Leaf className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-widest text-white uppercase">
              {brand.name}
            </p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/farmer/login"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-5 py-2 font-semibold text-[#1B4332] shadow-lg transition-all hover:scale-105 hover:shadow-white/30"
          >
            <span className="relative z-10">Sign in</span>
            <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-white to-white opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
