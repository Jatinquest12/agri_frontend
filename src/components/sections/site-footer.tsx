import Link from "next/link";

import { brand, footerLinks } from "@/data/site-content";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1B4332] bg-[#1B4332] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-8">
        <div>
          <p className="text-sm font-semibold text-white">
            {brand.legalName}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
            {brand.tagline}. Built for pilots and production API integration.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Product
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {footerLinks.product.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[#A5D6A7] underline-offset-2 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Developers
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {footerLinks.developers.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[#A5D6A7] underline-offset-2 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/80">
            Set{" "}
            <code className="rounded border border-[#A5D6A7]/30 bg-[#1B4332] px-1 py-0.5 text-[#A5D6A7]">
              NEXT_PUBLIC_BACKEND_API_BASE
            </code>{" "}
            in <code className="rounded border border-[#A5D6A7]/30 bg-[#1B4332] px-1 py-0.5 text-[#A5D6A7]">.env.local</code>.
          </p>
        </div>
      </div>
      <div className="border-t border-[#A5D6A7]/20 px-4 py-4 text-center text-xs text-white/60">
        © {year} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
