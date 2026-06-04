import type {
  ExecutionPhase,
  FeatureCard,
  HeroContent,
  InfoSectionContent,
  NavItem,
  PortalCard,
  StatItem,
} from "@/types/site-content";

export const brand = {
  name: "Agritrust",
  tagline: "Farm registry, crop intelligence, and verifiable proof",
  legalName: "Agritrust Platform",
} as const;

export const navItems: NavItem[] = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#workflow" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Access", href: "#access" },
];

export const heroContent: HeroContent = {
  eyebrow: "Agricultural trust & verification",
  title: "One platform to register farms, monitor crops, and prove authenticity",
  description:
    "Agritrust helps farmers manage land records and crop insights, gives administrators operational visibility, and lets buyers and insurers verify farm proof on-chain—without cryptocurrency or public ledgers.",
  benefits: [
    "Digital farm registry with GPS and survey validation",
    "Satellite-informed crop health and analytics",
    "Permissioned blockchain proof of agriculture (PoA)",
    "Public QR verification for supply-chain trust",
  ],
  primaryCta: { label: "Farmer sign in", href: "/farmer/login" },
  secondaryCta: { label: "Verify a proof", href: "/verify" },
};

export const stats: StatItem[] = [
  { label: "Stakeholders", value: "3 portals", detail: "Farmer, admin, public" },
  { label: "Proof model", value: "PoA + hash", detail: "Hyperledger Fabric ready" },
  { label: "Data sources", value: "Multi-source", detail: "Registry, satellite, IoT" },
  { label: "Deployment", value: "API-first", detail: "Next.js + REST backend" },
];

export const featureCards: FeatureCard[] = [
  {
    icon: "registry",
    title: "Farm registry",
    description:
      "Register parcels with survey numbers, crop type, acreage, and GPS. Admins review and approve before records enter the shared registry.",
  },
  {
    icon: "monitoring",
    title: "Crop intelligence",
    description:
      "Combine registry data with satellite and analytics APIs for health scores, land-use signals, and operational dashboards.",
  },
  {
    icon: "proof",
    title: "Proof of agriculture",
    description:
      "Generate verifiable proof artifacts and anchor hashes on a permissioned ledger for insurers, banks, and marketplaces.",
  },
  {
    icon: "verify",
    title: "Public verification",
    description:
      "Anyone can scan a QR or enter a proof ID to confirm validity and provenance—no account required.",
  },
];

export const problemSection: InfoSectionContent = {
  id: "problem",
  title: "Why agritech needs a trust layer",
  subtitle:
    "Fragmented records, manual inspections, and opaque supply chains slow insurance, credit, and trade.",
  points: [
    "Farm-level data is inconsistent or unavailable to institutions",
    "Insurance claims rely on slow, manual field visits",
    "Lenders lack timely, auditable signals for smallholder credit",
    "Buyers cannot easily confirm origin and quality claims",
  ],
  columns: 2,
};

export const solutionSection: InfoSectionContent = {
  id: "product",
  title: "Built for real operations—not slide decks",
  subtitle:
    "Agritrust connects operational workflows to APIs you can deploy today, with room to scale AI and ledger integrations.",
  points: [
    "Farmer workspace for registration, insights, notifications, and proof tooling",
    "Admin console for approvals, analytics, verification, and role-aware access",
    "Unified farm API as the single source of truth across portals",
    "OTP-based auth with JWT for protected routes (demo-friendly for pilots)",
  ],
  columns: 2,
};

export const technologySection: InfoSectionContent = {
  id: "technology",
  title: "Enterprise-ready architecture",
  points: [
    "Next.js presentation layer with accessible, responsive UI",
    "REST backend for registry, auth, analytics, and proof verification",
    "Hyperledger Fabric integration path for immutable PoA storage",
    "PostgreSQL and time-series friendly data layer for scale-out pilots",
  ],
  columns: 2,
};

export const stakeholdersSection: InfoSectionContent = {
  id: "stakeholders",
  title: "Who benefits",
  points: [
    "Farmers — register land, view insights, share verifiable proof",
    "Agronomists & admins — approve farms, monitor risk, audit activity",
    "Insurers & banks — trigger and validate claims with trusted data",
    "Buyers & cooperatives — scan QR codes to confirm provenance",
  ],
  columns: 2,
};

export const systemWorkflow: string[] = [
  "Farmer registers a farm with survey, crop, acreage, and GPS coordinates",
  "Admin reviews the record and approves it into the shared registry",
  "Satellite and analytics pipelines enrich crop health and land-use context",
  "Proof of agriculture is generated and its hash is stored on the ledger",
  "Insurers or partners verify proof via the public portal or API",
];

export const executionPhases: ExecutionPhase[] = [
  { title: "Registry & auth on production APIs", duration: "Phase 1" },
  { title: "Monitoring, insights, and proof flows", duration: "Phase 2" },
  { title: "Pilot with insurers, banks, or buyers", duration: "Phase 3" },
  { title: "Regional rollout and partner integrations", duration: "Phase 4" },
];

export const conclusionHighlights: string[] = [
  "Faster, evidence-based insurance and risk workflows",
  "Improved credit access through auditable farm signals",
  "Transparent farm-to-market traceability for buyers",
  "A single platform your team can extend via APIs",
];

export const portalCards: PortalCard[] = [
  {
    title: "Farmer workspace",
    description:
      "Register farms, track crop insights, manage notifications, and generate shareable proof.",
    href: "/farmer/login",
    cta: "Open farmer app",
    audience: "Growers & field teams",
  },
  {
    title: "Admin console",
    description:
      "Approve registrations, review verification activity, and monitor platform analytics.",
    href: "/admin/login",
    cta: "Open admin console",
    audience: "Agronomists & operations",
  },
  {
    title: "Public verifier",
    description:
      "Validate proof IDs and QR payloads without signing in—built for supply-chain checks.",
    href: "/verify",
    cta: "Verify proof",
    audience: "Buyers, auditors, public",
  },
];

export const trustPillars = [
  {
    title: "Permissioned ledger",
    description: "Hyperledger Fabric for PoA hashes—no public cryptocurrency required.",
  },
  {
    title: "API-first design",
    description: "Next.js portals backed by REST endpoints your team can integrate today.",
  },
  {
    title: "Role-based access",
    description: "Separate farmer, admin, and public verify surfaces with OTP + JWT auth.",
  },
  {
    title: "Supply-chain ready",
    description: "QR and hash verification flows for buyers, insurers, and auditors.",
  },
] as const;

export const footerLinks = {
  product: [
    { label: "Farmer app", href: "/farmer/login" },
    { label: "Admin console", href: "/admin/login" },
    { label: "Public verify", href: "/verify" },
  ],
  developers: [
    { label: "API lab", href: "/lab" },
    { label: "Implementation plan", href: "/docs/FRONTEND_IMPLEMENTATION_PLAN.md" },
  ],
} as const;
