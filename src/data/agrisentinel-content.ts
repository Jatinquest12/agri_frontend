import type {
  ExecutionPhase,
  HeroContent,
  InfoSectionContent,
  NavItem,
} from "@/types/agrisentinel";

export const navItems: NavItem[] = [
  { label: "Solution", href: "#solution" },
  { label: "Architecture", href: "#architecture" },
  { label: "Execution", href: "#execution" },
  { label: "Business", href: "#business" },
];

export const heroContent: HeroContent = {
  eyebrow: "Blockchain Innovation Submission",
  title:
    "AgriSentinel: Data-Driven Farming, Automated Insurance, and Financial Inclusion",
  description:
    "AgriSentinel is a blockchain-powered agricultural intelligence platform that combines AI, IoT, and permissioned blockchain to enable transparent farm monitoring, automated crop insurance workflows, farmer credit scoring, and trusted farm-to-market traceability.",
  benefits: [
    "Automated crop insurance claims",
    "Data-backed farmer credit scoring",
    "Real-time crop monitoring and analytics",
    "Transparent farm-to-market traceability",
  ],
};

export const problemSection: InfoSectionContent = {
  id: "problem",
  title: "Problem Statement",
  points: [
    "Lack of reliable farm-level data",
    "Manual and delayed insurance claim processing",
    "Limited access to credit for farmers",
    "Absence of traceability in agricultural produce",
  ],
  columns: 1,
};

export const challengesSection: InfoSectionContent = {
  id: "challenges",
  title: "Key Challenges",
  points: [
    "Trust gap between farmers, insurers, and banks",
    "Dependence on manual inspections",
    "Fragmented data sources (IoT, satellite, weather)",
    "High risk in agricultural lending",
  ],
  columns: 1,
};

export const solutionSection: InfoSectionContent = {
  id: "solution",
  title: "Innovative Solution",
  subtitle:
    "A blockchain-based agricultural ecosystem with AI, data pipelines, and multi-stakeholder trust.",
  points: [
    "AI-powered crop monitoring and yield prediction",
    "Blockchain-based Proof of Agriculture (PoA)",
    "Automated insurance claim processing",
    "Real-time data ingestion from IoT and satellite sources",
    "Farmer credit scoring and marketplace integration",
  ],
  columns: 2,
};

export const blockchainSection: InfoSectionContent = {
  id: "blockchain",
  title: "Blockchain Applicability",
  points: [
    "Immutability - Prevents data manipulation",
    "Transparency - Builds trust across stakeholders",
    "Decentralization - Eliminates dependency on intermediaries",
    "Smart contracts - Automate insurance and verification",
    "Audit trail - Tracks farm data lifecycle",
  ],
  columns: 2,
};

export const architectureSection: InfoSectionContent = {
  id: "architecture",
  title: "Technical Architecture (5 Layers)",
  points: [
    "Presentation Layer - Farmer mobile app, dashboards, bank and insurer portals",
    "Application Layer - APIs, backend services, data processing engines",
    "AI Engine Layer - Crop classification, yield prediction, anomaly detection",
    "Blockchain Layer - Hyperledger Fabric for proof storage and validation",
    "Data Layer - PostgreSQL, InfluxDB, data lake (S3), IPFS",
  ],
  columns: 1,
};

export const stakeholdersSection: InfoSectionContent = {
  id: "stakeholders",
  title: "Stakeholders",
  points: [
    "Farmers",
    "Government authorities",
    "Insurance companies",
    "Banks and financial institutions",
    "AgriTech providers",
    "Buyers and marketplaces",
  ],
  columns: 1,
};

export const differentiationSection: InfoSectionContent = {
  id: "differentiation",
  title: "Differentiation",
  points: [
    "Real-time data-driven farming insights",
    "Automated insurance claim settlement",
    "Blockchain-based proof of farm activity",
    "AI-driven credit scoring",
    "End-to-end traceability of produce",
  ],
  columns: 1,
};

export const platformDesignSection: InfoSectionContent = {
  id: "design",
  title: "Platform Design",
  points: [
    "Built on Hyperledger Fabric (permissioned blockchain)",
    "Integration with government land registry systems",
    "Secure identity-based access control",
    "No cryptocurrency dependency",
    "Scalable and enterprise-grade architecture",
  ],
  columns: 1,
};

export const smartContractsSection: InfoSectionContent = {
  id: "contracts",
  title: "Smart Contracts Modules",
  points: [
    "Farm registration validation",
    "Proof of Agriculture storage",
    "Insurance claim triggering",
    "Credit scoring integration",
    "Marketplace verification",
  ],
  columns: 1,
};

export const regulatorySection: InfoSectionContent = {
  id: "compliance",
  title: "Regulatory Compliance",
  points: [
    "Agricultural governance frameworks",
    "Crop insurance schemes (PMFBY model alignment)",
    "Digital land record systems",
    "Financial compliance standards",
  ],
  columns: 1,
};

export const securitySection: InfoSectionContent = {
  id: "security",
  title: "Security and Performance",
  points: [
    "End-to-end encryption",
    "Secure identity and access management",
    "High-volume data ingestion capability",
    "Real-time processing of farm data",
    "Scalable infrastructure for nationwide deployment",
  ],
  columns: 1,
};

export const marketSection: InfoSectionContent = {
  id: "market",
  title: "Market Opportunity",
  points: [
    "Large agricultural sector in India",
    "Increasing adoption of AgriTech solutions",
    "Growing demand for crop insurance",
    "Rising need for farmer credit access",
    "Government focus on digital agriculture",
  ],
  columns: 1,
};

export const outcomesSection: InfoSectionContent = {
  id: "outcomes",
  title: "Expected Outcomes",
  points: [
    "Faster and transparent insurance claim settlement",
    "Improved farmer access to credit",
    "Reduced agricultural risk",
    "Increased crop yield efficiency",
    "Strengthened trust across ecosystem",
  ],
  columns: 1,
};

export const pilotSection: InfoSectionContent = {
  id: "pilot",
  title: "Pilot Plan",
  points: [
    "Deployment in selected agricultural regions",
    "Integration with insurers and banks",
    "Real-time monitoring of crop data",
    "Performance evaluation over one crop cycle",
  ],
  columns: 1,
};

export const collaborationSection: InfoSectionContent = {
  id: "collaboration",
  title: "Government and Industry Collaboration",
  subtitle: "Key partners needed for successful deployment and scale.",
  points: [
    "Agricultural departments",
    "Crop insurance providers",
    "Banks and NBFCs",
    "Satellite and IoT providers",
    "AgriTech ecosystem players",
  ],
  columns: 2,
};

export const businessSection: InfoSectionContent = {
  id: "business",
  title: "Business Model",
  points: [
    "Platform licensing (government and institutions)",
    "Transaction-based insurance processing fees",
    "Credit scoring services for banks",
    "Data analytics and insights",
    "Marketplace integration fees",
  ],
  columns: 1,
};

export const adoptionSection: InfoSectionContent = {
  id: "adoption",
  title: "Adoption Strategy",
  points: [
    "Collaboration with government programs",
    "Farmer awareness and onboarding campaigns",
    "Partnerships with financial institutions",
    "Gradual migration from traditional systems",
  ],
  columns: 1,
};

export const useCaseSection: InfoSectionContent = {
  id: "usecase",
  title: "Use Case Example",
  points: [
    "IoT and satellite data monitor crop health",
    "AI detects anomaly (low yield risk)",
    "Insurance claim is triggered automatically",
    "Verified payout is processed",
    "Bank accesses credit score and issues loan",
    "Buyer scans QR to verify crop origin and quality",
  ],
  columns: 2,
};

export const systemWorkflow: string[] = [
  "Farmer registers farm with land and GPS details",
  "System verifies ownership via government registry",
  "IoT, satellite, and weather data are ingested continuously",
  "AI processes data to generate crop insights",
  "Proof of Agriculture (PoA) is generated",
  "PoA hash stored on blockchain",
  "Insurance claims triggered automatically on anomalies",
  "Credit scoring generated for financial institutions",
  "Produce traceability enabled via QR-based marketplace",
];

export const executionPhases: ExecutionPhase[] = [
  { title: "Core Platform Development", duration: "0-6 months" },
  { title: "Pilot Deployment with Farmers", duration: "6-12 months" },
  { title: "AI and Data Integration Scaling", duration: "12-18 months" },
  { title: "Nationwide Rollout", duration: "18-30 months" },
];

export const conclusionHighlights: string[] = [
  "Automated insurance and risk management",
  "Financial inclusion for farmers",
  "Real-time agricultural intelligence",
  "Trusted farm-to-market traceability",
];
