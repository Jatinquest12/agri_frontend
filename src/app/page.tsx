import { ConclusionSection } from "@/components/sections/conclusion-section";
import { ExecutionPlanSection } from "@/components/sections/execution-plan-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { InfoSection } from "@/components/sections/info-section";
import { PortalSection } from "@/components/sections/portal-section";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { StatsSection } from "@/components/sections/stats-section";
import { TrustSection } from "@/components/sections/trust-section";
import { WorkflowSection } from "@/components/sections/workflow-section";
import {
  conclusionHighlights,
  executionPhases,
  featureCards,
  heroContent,
  navItems,
  portalCards,
  problemSection,
  solutionSection,
  stakeholdersSection,
  stats,
  systemWorkflow,
  technologySection,
  trustPillars,
} from "@/data/site-content";

export default function HomePage() {
  return (
    <div className="app-backdrop flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 text-slate-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 dark:text-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <SiteHeader navItems={navItems} />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 md:gap-12 md:px-8 md:py-12"
      >
        <HeroSection content={heroContent} />
        <StatsSection items={stats} />
        <TrustSection pillars={trustPillars} />
        <FeaturesSection features={featureCards} />
        <InfoSection {...problemSection} />
        <InfoSection {...solutionSection} />
        <InfoSection {...technologySection} />
        <InfoSection {...stakeholdersSection} />
        <WorkflowSection steps={systemWorkflow} />
        <ExecutionPlanSection phases={executionPhases} />
        <PortalSection portals={portalCards} />
        <ConclusionSection highlights={conclusionHighlights} />
      </main>
      <SiteFooter />
    </div>
  );
}
