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
};
