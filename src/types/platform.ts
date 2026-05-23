export type UserRole = "farmer" | "admin" | "agronomist";

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  verified: boolean;
};

export type FarmStatus = "draft" | "pending_review" | "approved" | "rejected";

export type GeoPoint = { lat: number; lng: number };

export type Farm = {
  id: string;
  name: string;
  cropType: string;
  areaAcres: number;
  status: FarmStatus;
  center: GeoPoint;
  boundary: GeoPoint[];
  surveyNumber?: string;
  farmerName?: string;
  aadhaarId?: string;
  proofHash?: string;
  metadataHashFull?: string;
  txId?: string;
  /** Populated when monitoring AI is wired (Phase 2). */
  healthScore?: number;
  yieldPredictionKg: number;
  lastVerifiedAt?: string;
  landDocNames: string[];
  cropImageNames: string[];
};

export type NotificationKind =
  | "weather"
  | "crop_risk"
  | "verification"
  | "admin_message";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type ProofEvent = {
  id: string;
  label: string;
  hash: string;
  txId: string;
  at: string;
  status: "valid" | "pending" | "flagged";
};

export type AiAlert = {
  id: string;
  severity: "info" | "warn" | "critical";
  title: string;
  detail: string;
  at: string;
};

export type HealthTrendPoint = { date: string; score: number };

export type PendingFarmer = {
  id: string;
  name: string;
  phone: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
};

export type PendingFarmApproval = {
  farmId: string;
  farmerName: string;
  name: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
};

export type AiJobRow = {
  id: string;
  farmId: string;
  type: string;
  status: "ok" | "failed" | "review";
  confidence?: number;
  updatedAt: string;
};

export type AuditLogEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
};
