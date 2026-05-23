import type { NavItem } from "@/types/agrisentinel";

type SiteHeaderProps = {
  navItems: NavItem[];
};

export function SiteHeader({ navItems }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-green-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
            AgriSentinel
          </p>
          <p className="text-sm font-medium text-slate-600">
            AI and Blockchain Agricultural Intelligence Platform
          </p>
        </div>
        <nav className="flex flex-wrap gap-2 text-xs md:text-sm">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-green-200 px-3 py-1.5 hover:bg-green-100"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
