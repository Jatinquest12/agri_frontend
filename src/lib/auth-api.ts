import { apiRequest } from "./api";
import type { UserRole } from "@/types/platform";

export type BackendUser = {
  id: string;
  phone: string;
  role: UserRole;
  name?: string;
  created_at: string;
};

export type AuthTokensResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  user: BackendUser;
};

export async function requestOtp(phone: string): Promise<{
  message: string;
  expires_in_seconds: number;
}> {
  return apiRequest("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ phone }),
    skipAuth: true,
  });
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<AuthTokensResponse> {
  return apiRequest("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phone, code }),
    skipAuth: true,
  });
}

export async function refreshSession(
  refresh_token: string,
): Promise<AuthTokensResponse> {
  return apiRequest("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
    skipAuth: true,
  });
}

export async function logoutSession(refresh_token: string): Promise<void> {
  await apiRequest("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
    skipAuth: true,
  });
}

export async function fetchMe(): Promise<{ user: BackendUser }> {
  return apiRequest("/auth/me");
}
