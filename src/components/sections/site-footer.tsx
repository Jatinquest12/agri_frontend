import Link from "next/link";
import { ArrowUpRight, Leaf } from "lucide-react";

import { brand, footerLinks } from "@/data/site-content";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#2E7D32]/20 bg-[#1B4332] text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[20%] -top-[20%] h-[80%] w-[50%] rounded-full bg-[#2E7D32]/20 blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[60%] w-[40%] rounded-full bg-emerald-400/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-8 md:pt-24 md:pb-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Column */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#1B4332] shadow-lg shadow-[#2E7D32]/20 border border-white/10">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                {brand.name}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#A5D6A7]/80">
              {brand.tagline}. Built for pilots and scalable production API integration. We transform farm data into verifiable trust.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                <span className="sr-only">Twitter</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                <span className="sr-only">GitHub</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </div>
          
          {/* Link Columns */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.product.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="group inline-flex items-center text-sm font-medium text-[#A5D6A7]/80 hover:text-white transition-colors">
                        {link.label}
                        <ArrowUpRight className="ml-1.5 h-3 w-3 opacity-0 -translate-y-1 translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Developers</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.developers.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="group inline-flex items-center text-sm font-medium text-[#A5D6A7]/80 hover:text-white transition-colors">
                        {link.label}
                        <ArrowUpRight className="ml-1.5 h-3 w-3 opacity-0 -translate-y-1 translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Config Card */}
            <div className="mt-10 md:mt-0">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Configuration</h3>
              <div className="mt-6">
                <div className="rounded-2xl bg-black/20 p-5 border border-white/5 backdrop-blur-md">
                  <p className="text-sm leading-6 text-[#A5D6A7]/90">
                    To start building locally, configure your environment variables:
                  </p>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-black/40 border border-[#2E7D32]/30 px-3 py-2 font-mono text-xs text-[#A5D6A7]">
                    <span>NEXT_PUBLIC_BACKEND_API_BASE</span>
                    <div className="h-2 w-2 rounded-full bg-[#A5D6A7] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs leading-5 text-[#A5D6A7]/60">
            &copy; {year} {brand.legalName}. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0 text-xs text-[#A5D6A7]/60">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
