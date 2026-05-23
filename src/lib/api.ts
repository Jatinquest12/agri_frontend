import { refreshSession } from "./auth-api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./token-storage";

const defaultApiBase =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE ?? "http://localhost:5000/api";

export function getApiBase(): string {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("agritrust_api_base");
    if (stored) return stored;
  }
  return defaultApiBase;
}

export type ApiRequestOptions = RequestInit & {
  skipAuth?: boolean;
};

let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshTokens(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const tokens = await refreshSession(refresh);
        setTokens(tokens.access_token, tokens.refresh_token);
        return true;
      } catch {
        clearTokens();
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

function authHeaders(skipAuth?: boolean): Record<string, string> {
  if (skipAuth) return {};
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function apiRequest<T = unknown>(
  path: string,
  options?: ApiRequestOptions,
): Promise<T> {
  const base = getApiBase().replace(/\/$/, "");
  const { skipAuth, ...fetchOptions } = options ?? {};

  const doFetch = async (retried: boolean): Promise<Response> => {
    return fetch(`${base}${path}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(skipAuth),
        ...(fetchOptions.headers ?? {}),
      },
    });
  };

  let response = await doFetch(false);

  if (response.status === 401 && !skipAuth && getRefreshToken()) {
    const refreshed = await tryRefreshTokens();
    if (refreshed) {
      response = await doFetch(true);
    }
  }

  const data = (await response.json()) as { message?: string } & Record<
    string,
    unknown
  >;
  if (!response.ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "Request failed",
    );
  }
  return data as T;
}

/** GET JSON; returns null on 404, throws on other errors. */
export async function apiGetJsonOrNull<T = unknown>(
  path: string,
  options?: ApiRequestOptions,
): Promise<T | null> {
  const base = getApiBase().replace(/\/$/, "");
  const { skipAuth, ...fetchOptions } = options ?? {};

  const doFetch = async (): Promise<Response> => {
    return fetch(`${base}${path}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(skipAuth),
        ...(fetchOptions.headers ?? {}),
      },
    });
  };

  let response = await doFetch();

  if (response.status === 401 && !skipAuth && getRefreshToken()) {
    const refreshed = await tryRefreshTokens();
    if (refreshed) response = await doFetch();
  }

  if (response.status === 404) return null;
  const data = (await response.json()) as { message?: string } & Record<
    string,
    unknown
  >;
  if (!response.ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "Request failed",
    );
  }
  return data as T;
}

export function setApiBaseForSession(base: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("agritrust_api_base", base);
}
