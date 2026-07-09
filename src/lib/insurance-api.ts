import { apiRequest } from "./api";

export type InsuranceClaim = {
  id: string;
  farm_id: string;
  health_score: number;
  triggered: boolean;
  threshold: number;
  created_at: string;
  blockchain_tx_id?: string;
  oracle_1_validated?: boolean;
  oracle_2_validated?: boolean;
  payout_released?: boolean;
  disputed?: boolean;
  dispute_reason?: string;
};

export type EvaluateClaimResponse = {
  message: string;
  claim: InsuranceClaim;
};

export type ListClaimsResponse = {
  claims: InsuranceClaim[];
};

export type OracleValidationResult = {
  message: string;
  claim_id: string;
  oracle_id: string;
  validated: boolean;
  both_validated: boolean;
};

export type PayoutResult = {
  message: string;
  claim_id: string;
  blockchain_tx_id?: string;
};

export type DisputeResult = {
  message: string;
  claim_id: string;
};

export type ChainClaimRecord = {
  claim: InsuranceClaim | null;
};

/** POST /api/insurance/:farmId/evaluate */
export function evaluateClaim(
  farmId: string,
  healthScoreThreshold = 45,
): Promise<EvaluateClaimResponse> {
  return apiRequest(`/insurance/${encodeURIComponent(farmId)}/evaluate`, {
    method: "POST",
    body: JSON.stringify({ health_score_threshold: healthScoreThreshold }),
  });
}

/** GET /api/insurance/:farmId/claims */
export function fetchClaimsByFarm(farmId: string): Promise<ListClaimsResponse> {
  return apiRequest(`/insurance/${encodeURIComponent(farmId)}/claims`);
}

/** GET /api/insurance/claims/all */
export function fetchAllClaims(): Promise<ListClaimsResponse> {
  return apiRequest("/insurance/claims/all");
}

/** POST /api/insurance/claims/:claimId/validate */
export function validateClaim(
  claimId: string,
  oracleId: "oracle_1" | "oracle_2",
): Promise<OracleValidationResult> {
  return apiRequest(`/insurance/claims/${encodeURIComponent(claimId)}/validate`, {
    method: "POST",
    body: JSON.stringify({ oracle_id: oracleId }),
  });
}

/** POST /api/insurance/claims/:claimId/release */
export function releasePayout(claimId: string): Promise<PayoutResult> {
  return apiRequest(`/insurance/claims/${encodeURIComponent(claimId)}/release`, {
    method: "POST",
  });
}

/** POST /api/insurance/claims/:claimId/dispute */
export function disputeClaim(
  claimId: string,
  disputeReason: string,
): Promise<DisputeResult> {
  return apiRequest(`/insurance/claims/${encodeURIComponent(claimId)}/dispute`, {
    method: "POST",
    body: JSON.stringify({ dispute_reason: disputeReason }),
  });
}

/** GET /api/insurance/claims/:claimId/chain */
export function fetchClaimOnChain(claimId: string): Promise<ChainClaimRecord> {
  return apiRequest(`/insurance/claims/${encodeURIComponent(claimId)}/chain`);
}
