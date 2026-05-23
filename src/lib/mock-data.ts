import type {
  AiAlert,
  AiJobRow,
  AppNotification,
  AuditLogEntry,
  Farm,
  HealthTrendPoint,
  PendingFarmApproval,
  PendingFarmer,
  ProofEvent,
} from "@/types/platform";

export const mockHealthTrend: HealthTrendPoint[] = [
  { date: "Jan", score: 62 },
  { date: "Feb", score: 68 },
  { date: "Mar", score: 71 },
  { date: "Apr", score: 74 },
  { date: "May", score: 78 },
  { date: "Jun", score: 76 },
];

export const mockAiAlerts: AiAlert[] = [
  {
    id: "a1",
    severity: "warn",
    title: "NDVI dip in north parcel",
    detail: "Possible water stress compared to the prior week baseline.",
    at: new Date().toISOString(),
  },
  {
    id: "a2",
    severity: "info",
    title: "Growth stage: flowering",
    detail: "Model confidence 0.84 for rice across registered polygons.",
    at: new Date().toISOString(),
  },
];

export function seedFarms(): Farm[] {
  return [
    {
      id: "farm-demo-1",
      name: "Parcel A — Kharif Rice",
      cropType: "Rice",
      areaAcres: 3.4,
      status: "approved",
      center: { lat: 17.3852, lng: 78.4869 },
      boundary: [
        { lat: 17.3855, lng: 78.4865 },
        { lat: 17.3858, lng: 78.4872 },
        { lat: 17.3849, lng: 78.4874 },
        { lat: 17.3848, lng: 78.4866 },
      ],
      surveyNumber: "SURVEY-1001",
      proofHash: "0x9f2c…e4a1",
      txId: "0xbb7…91c2",
      healthScore: 78,
      yieldPredictionKg: 4200,
      lastVerifiedAt: new Date().toISOString(),
      landDocNames: ["patta.pdf"],
      cropImageNames: ["canopy_01.jpg"],
    },
    {
      id: "farm-demo-2",
      name: "Parcel B — Vegetables",
      cropType: "Tomato",
      areaAcres: 1.1,
      status: "pending_review",
      center: { lat: 17.42, lng: 78.45 },
      boundary: [
        { lat: 17.4202, lng: 78.4496 },
        { lat: 17.4204, lng: 78.4502 },
        { lat: 17.4198, lng: 78.4504 },
      ],
      healthScore: 64,
      yieldPredictionKg: 980,
      landDocNames: [],
      cropImageNames: [],
    },
  ];
}

export const mockNotifications: AppNotification[] = [
  {
    id: "n1",
    kind: "weather",
    title: "Heavy rain expected",
    body: "48h cumulative rainfall may exceed 80mm in your district.",
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: "n2",
    kind: "crop_risk",
    title: "Heat stress window",
    body: "Daytime highs above 38°C for 3 consecutive days in forecast.",
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: "n3",
    kind: "verification",
    title: "Proof anchored",
    body: "Latest proof batch was written to the verification registry.",
    createdAt: new Date().toISOString(),
    read: true,
  },
  {
    id: "n4",
    kind: "admin_message",
    title: "Document reminder",
    body: "Please upload updated land record for Parcel B.",
    createdAt: new Date().toISOString(),
    read: false,
  },
];

export const mockProofHistory: ProofEvent[] = [
  {
    id: "p1",
    label: "Season anchor",
    hash: "0x9f2c4e…a1",
    txId: "0xbb71…91c2",
    at: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "valid",
  },
  {
    id: "p2",
    label: "Mid-season attestation",
    hash: "0x3aa1…77bd",
    txId: "0xc901…22fa",
    at: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "valid",
  },
];

export const mockPendingFarmers: PendingFarmer[] = [
  {
    id: "pf-1",
    name: "Sita Devi",
    phone: "+91 9xxxxxxxxx",
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    status: "pending",
  },
  {
    id: "pf-2",
    name: "Arun Patel",
    phone: "+91 8xxxxxxxxx",
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    status: "pending",
  },
];

export const mockPendingFarms: PendingFarmApproval[] = [
  {
    farmId: "farm-demo-2",
    farmerName: "You (demo)",
    name: "Parcel B — Vegetables",
    submittedAt: new Date(Date.now() - 7200000).toISOString(),
    status: "pending",
  },
];

export const mockAiJobs: AiJobRow[] = [
  {
    id: "job-1",
    farmId: "farm-demo-1",
    type: "health_score",
    status: "ok",
    confidence: 0.86,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "job-2",
    farmId: "farm-demo-2",
    type: "disease_scan",
    status: "failed",
    updatedAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "job-3",
    farmId: "farm-demo-1",
    type: "yield_forecast",
    status: "review",
    confidence: 0.58,
    updatedAt: new Date(Date.now() - 1200000).toISOString(),
  },
];

export const mockAudit: AuditLogEntry[] = [
  {
    id: "l1",
    actor: "admin@demo",
    action: "farm.approve",
    target: "farm-demo-1",
    at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "l2",
    actor: "system",
    action: "proof.anchor",
    target: "0xbb71…91c2",
    at: new Date(Date.now() - 86400000).toISOString(),
  },
];
