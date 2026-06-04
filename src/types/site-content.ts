export type Columns = 1 | 2 | 3;

export type InfoSectionContent = {
  id: string;
  title: string;
  subtitle?: string;
  points: string[];
  columns?: Columns;
};

export type ExecutionPhase = {
  title: string;
  duration: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export type StatItem = {
  label: string;
  value: string;
  detail?: string;
};

export type PortalCard = {
  title: string;
  description: string;
  href: string;
  cta: string;
  audience: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon: "registry" | "monitoring" | "proof" | "verify";
};
