import { apiRequest } from "./api";

export type UnifiedProof = {
  id: string;
  farm_id: string;
  content_hash: string;
  document: {
    schema_version: string;
    farm_id: string;
    created_at: string;
    content_hash: string;
    assertions: { key: string; value: string | number | boolean }[];
  };
  created_at: string;
  blockchain_tx_id?: string;
  anchored_at?: string;
};

export type VerifyProofResponse = {
  verified: boolean;
  proof_id?: string;
  chain: { tx_id?: string } | null;
  document: { farm_id?: string; content_hash?: string } | null;
  record: UnifiedProof | null;
};

export function createProof(farmId: string): Promise<{ proof: UnifiedProof }> {
  return apiRequest("/proof/create", {
    method: "POST",
    body: JSON.stringify({ farm_id: farmId }),
  });
}

export function verifyProofPost(params: {
  farm_id?: string;
  proof_id?: string;
  hash?: string;
}): Promise<VerifyProofResponse> {
  return apiRequest("/proof/verify", {
    method: "POST",
    body: JSON.stringify(params),
    skipAuth: true,
  });
}

export function getProofById(proofId: string): Promise<{ proof: UnifiedProof }> {
  return apiRequest(`/proof/${encodeURIComponent(proofId)}`, {
    skipAuth: true,
  });
}
