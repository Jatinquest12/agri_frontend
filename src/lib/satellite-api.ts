import { apiGetJsonOrNull, apiRequest } from "./api";

export type BhuvanLulcYear = "0506" | "1112";

export type LulcClassStat = {
  code: string;
  label: string;
  area_sqkm: number;
  percent: number;
};

export type BhuvanLulcStats = {
  name: string;
  year: BhuvanLulcYear;
  scope: "district" | "state";
  scope_code: string;
  total_area_sqkm: number;
  classes: LulcClassStat[];
  agricultural_area_sqkm: number;
  agricultural_percent: number;
  crop_index: number;
  source: "bhuvan";
  fetched_at: string;
};

export type FarmLulcResponse = {
  farm_id: string;
  lulc: BhuvanLulcStats;
};

export function fetchFarmLulc(
  farmId: string,
  params?: { year?: BhuvanLulcYear; distcode?: string; statcode?: string },
): Promise<FarmLulcResponse> {
  const q = new URLSearchParams();
  if (params?.year) q.set("year", params.year);
  if (params?.distcode) q.set("distcode", params.distcode);
  if (params?.statcode) q.set("statcode", params.statcode);
  const qs = q.toString();
  return apiRequest(
    `/satellite/farms/${encodeURIComponent(farmId)}/lulc${qs ? `?${qs}` : ""}`,
  );
}

export function fetchLulcByCode(params: {
  year?: BhuvanLulcYear;
  distcode?: string;
  statcode?: string;
  farm_id?: string;
}): Promise<{ lulc: BhuvanLulcStats }> {
  const q = new URLSearchParams();
  if (params.year) q.set("year", params.year);
  if (params.distcode) q.set("distcode", params.distcode);
  if (params.statcode) q.set("statcode", params.statcode);
  if (params.farm_id) q.set("farm_id", params.farm_id);
  return apiRequest(`/satellite/lulc?${q.toString()}`);
}

export function fetchFarmLulcOrNull(
  farmId: string,
  params?: { year?: BhuvanLulcYear; distcode?: string; statcode?: string },
): Promise<FarmLulcResponse | null> {
  const q = new URLSearchParams();
  if (params?.year) q.set("year", params.year);
  if (params?.distcode) q.set("distcode", params.distcode);
  if (params?.statcode) q.set("statcode", params.statcode);
  const qs = q.toString();
  return apiGetJsonOrNull(
    `/satellite/farms/${encodeURIComponent(farmId)}/lulc${qs ? `?${qs}` : ""}`,
  );
}

export function triggerBhuvanSatelliteIngest(
  farmId: string,
  body?: {
    year?: BhuvanLulcYear;
    distcode?: string;
    statcode?: string;
  },
): Promise<{ job: { id: string; status: string }; message: string }> {
  return apiRequest(`/monitoring/${encodeURIComponent(farmId)}/ingest/satellite`, {
    method: "POST",
    body: JSON.stringify({ fetch_bhuvan: true, ...body }),
  });
}
