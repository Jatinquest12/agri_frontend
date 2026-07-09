import { apiRequest } from "./api";

export type TokenStatus = "ACTIVE" | "LOCKED" | "RECALLED" | "REDEEMED";

export type CommodityToken = {
  id: string;
  farm_id: string;
  harvest_ref: string;
  batch_hash: string;
  owner_did_hash: string;
  qr_code_ref: string;
  status: TokenStatus;
  minted_at: string;
  blockchain_tx_id?: string;
  htlc_hash_lock?: string;
};

export type MintTokenInput = {
  farm_id: string;
  harvest_ref: string;
  batch_hash: string;
  owner_did_hash: string;
  qr_code_ref: string;
};

export type MintTokenResponse = {
  message: string;
  token: CommodityToken;
};

export type TransferTokenResponse = {
  message: string;
  token_id: string;
  status: TokenStatus;
  blockchain_tx_id?: string;
};

export type ClaimTransferResponse = {
  message: string;
  token_id: string;
  status: TokenStatus;
  blockchain_tx_id?: string;
};

export type RecallTokenResponse = {
  message: string;
  token_id: string;
  status: TokenStatus;
  blockchain_tx_id?: string;
};

export type HashSecretResponse = {
  htlc_hash_lock: string;
};

/** POST /api/marketplace/tokens/mint */
export function mintToken(input: MintTokenInput): Promise<MintTokenResponse> {
  return apiRequest("/marketplace/tokens/mint", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** POST /api/marketplace/tokens/:tokenId/transfer */
export function transferToken(
  tokenId: string,
  toOwnerDidHash: string,
  htlcHashLock: string,
): Promise<TransferTokenResponse> {
  return apiRequest(
    `/marketplace/tokens/${encodeURIComponent(tokenId)}/transfer`,
    {
      method: "POST",
      body: JSON.stringify({
        to_owner_did_hash: toOwnerDidHash,
        htlc_hash_lock: htlcHashLock,
      }),
    },
  );
}

/** POST /api/marketplace/tokens/:tokenId/claim */
export function claimTransfer(
  tokenId: string,
  htlcSecret: string,
): Promise<ClaimTransferResponse> {
  return apiRequest(
    `/marketplace/tokens/${encodeURIComponent(tokenId)}/claim`,
    {
      method: "POST",
      body: JSON.stringify({ htlc_secret: htlcSecret }),
    },
  );
}

/** POST /api/marketplace/tokens/:tokenId/recall */
export function recallToken(
  tokenId: string,
  recallReason: string,
): Promise<RecallTokenResponse> {
  return apiRequest(
    `/marketplace/tokens/${encodeURIComponent(tokenId)}/recall`,
    {
      method: "POST",
      body: JSON.stringify({ recall_reason: recallReason }),
    },
  );
}

/** GET /api/marketplace/tokens/:tokenId */
export function fetchToken(tokenId: string): Promise<{ token: CommodityToken }> {
  return apiRequest(`/marketplace/tokens/${encodeURIComponent(tokenId)}`);
}

/** GET /api/marketplace/tokens */
export function fetchAllTokens(): Promise<{ tokens: CommodityToken[] }> {
  return apiRequest("/marketplace/tokens");
}

/** POST /api/marketplace/tokens/hash-secret */
export function hashSecret(secret: string): Promise<HashSecretResponse> {
  return apiRequest("/marketplace/tokens/hash-secret", {
    method: "POST",
    body: JSON.stringify({ secret }),
  });
}
