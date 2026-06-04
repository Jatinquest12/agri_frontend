import { getApiBase } from "./api";

export type ApiHealthStatus = "checking" | "online" | "offline";

/** Lightweight reachability check (any HTTP response counts as online). */
export async function pingApiReachable(): Promise<boolean> {
  const base = getApiBase().replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${base}/farms`, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    return response.status < 500;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}
