import { apiRequest } from "./api";

export type CreditProfile = {
  farm_id: string;
  farmer_id: string;
  score: number;
  grade: string;
  factors: {
    health_score: number;
    proof_count: number;
    yield_predicted: number;
    land_area: number;
  };
  eligible_loan_amount_inr: number;
  generated_at: string;
  blockchain_tx_id?: string;
};

export type GenerateCreditResponse = {
  message: string;
  creditProfile: CreditProfile;
};

export type LatestCreditResponse = {
  creditProfile: CreditProfile;
};

export type FarmerCreditResponse = {
  credit_profile: CreditProfile;
};

/** POST /api/credit/:farmId/generate */
export function generateCreditScore(
  farmId: string,
): Promise<GenerateCreditResponse> {
  return apiRequest(`/credit/${encodeURIComponent(farmId)}/generate`, {
    method: "POST",
  });
}

/** GET /api/credit/:farmId/latest */
export function fetchLatestCreditScore(
  farmId: string,
): Promise<LatestCreditResponse> {
  return apiRequest(`/credit/${encodeURIComponent(farmId)}/latest`);
}

/** GET /api/farmer/:farmerId/credit-profile
 *  Farmer-level aggregated credit (keyed by aadhaar/farmer id, not farm id) */
export function fetchFarmerCreditProfile(
  farmerId: string,
): Promise<FarmerCreditResponse> {
  return apiRequest(`/farmer/${encodeURIComponent(farmerId)}/credit-profile`);
}
