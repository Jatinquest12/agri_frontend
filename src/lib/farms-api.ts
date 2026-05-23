import { apiGetJsonOrNull, apiRequest } from "./api";
import type { GeoJsonPolygonFeature } from "./geojson-utils";
import type { Farm, FarmStatus, GeoPoint } from "@/types/platform";

export const CROP_TYPES = [
  "wheat",
  "rice",
  "cotton",
  "maize",
  "sugarcane",
] as const;

export type CropType = (typeof CROP_TYPES)[number];

/** Minimal shape from `GET /api/farms` and `GET /api/farms/:id`. */
export type ApiFarmDto = {
  id: string;
  farmer_name: string;
  aadhaar_id: string;
  land_survey_number: string;
  crop_type: string;
  land_area_acres: number;
  gps: { latitude: number; longitude: number };
  registry_polygon?: { lat: number; lon: number }[];
  status: string;
  created_at?: string;
  metadata_hash?: string;
  blockchain_tx_id?: string;
  ownership_status?: string;
};

export type RegisterFarmInput = {
  farmer_name: string;
  aadhaar_id: string;
  land_survey_number: string;
  crop_type: CropType;
  land_area_acres: number;
  gps: { latitude: number; longitude: number };
};

export type RegisterFarmResponse = {
  message: string;
  farm: ApiFarmDto;
  farm_id?: string;
};

function ownershipToUi(status: string): FarmStatus {
  switch (status) {
    case "draft":
      return "draft";
    case "pending_registry":
      return "pending_review";
    case "verified":
      return "approved";
    case "rejected":
      return "rejected";
    default:
      return "pending_review";
  }
}

function domainStatusToUi(status: string): FarmStatus {
  if (status === "verified") return "approved";
  if (status === "rejected") return "rejected";
  return "pending_review";
}

function formatCrop(raw: string): string {
  if (!raw.length) return raw;
  return raw[0].toUpperCase() + raw.slice(1);
}

function shortHexHint(hex: string): string {
  const t = hex.trim();
  if (t.length <= 14) return t;
  return `${t.slice(0, 6)}…${t.slice(-4)}`;
}

/** Map backend farm JSON to the farmer/admin UI model. */
export function mapApiFarmToPlatform(f: ApiFarmDto): Farm {
  const uiStatus =
    f.ownership_status != null && f.ownership_status.length > 0
      ? ownershipToUi(f.ownership_status)
      : domainStatusToUi(f.status);

  const center: GeoPoint = {
    lat: f.gps.latitude,
    lng: f.gps.longitude,
  };
  const boundary: GeoPoint[] =
    Array.isArray(f.registry_polygon) && f.registry_polygon.length > 0
      ? f.registry_polygon.map((p) => ({ lat: p.lat, lng: p.lon }))
      : [center];

  const cropType = formatCrop(f.crop_type);
  const area = f.land_area_acres ?? 0;

  const name =
    `${f.land_survey_number} · ${cropType} (${f.farmer_name})`.slice(0, 120);

  return {
    id: f.id,
    name,
    cropType,
    areaAcres: area,
    status: uiStatus,
    center,
    boundary,
    surveyNumber: f.land_survey_number,
    farmerName: f.farmer_name,
    aadhaarId: f.aadhaar_id,
    proofHash:
      typeof f.metadata_hash === "string" && f.metadata_hash.length > 0
        ? shortHexHint(f.metadata_hash)
        : undefined,
    metadataHashFull: f.metadata_hash,
    txId:
      typeof f.blockchain_tx_id === "string" && f.blockchain_tx_id.length > 0
        ? f.blockchain_tx_id
        : undefined,
    yieldPredictionKg: Math.round(area * 900),
    lastVerifiedAt: f.created_at,
    landDocNames: [],
    cropImageNames: [],
  };
}

export async function fetchFarmsList(): Promise<Farm[]> {
  const body = await apiRequest<{ farms: ApiFarmDto[] }>("/farms");
  return body.farms.map(mapApiFarmToPlatform);
}

export async function fetchFarmById(id: string): Promise<Farm | null> {
  const body = await apiGetJsonOrNull<{ farm: ApiFarmDto }>(
    `/farms/${encodeURIComponent(id)}`,
  );
  if (!body?.farm) return null;
  return mapApiFarmToPlatform(body.farm);
}

export async function registerFarm(
  input: RegisterFarmInput,
): Promise<RegisterFarmResponse> {
  return apiRequest<RegisterFarmResponse>("/farms/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function validateFarmGeoJson(
  geojson: GeoJsonPolygonFeature,
): Promise<{ valid: true; feature: GeoJsonPolygonFeature }> {
  return apiRequest("/farms/geojson/validate", {
    method: "POST",
    body: JSON.stringify({ geojson }),
  });
}

export async function duplicateFarmCheck(params: {
  aadhaar_id: string;
  land_survey_number: string;
  geojson?: GeoJsonPolygonFeature;
  exclude_farm_id?: string;
}): Promise<{
  duplicate: boolean;
  matches: { farm_id: string; reasons: string[] }[];
}> {
  return apiRequest("/farms/duplicate-check", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function patchFarm(
  farmId: string,
  patch: {
    ownership_status?: "pending_registry" | "verified" | "rejected";
    farmer_name?: string;
    crop_type?: CropType;
    land_area_acres?: number;
    gps?: { latitude: number; longitude: number };
    boundary_geojson?: GeoJsonPolygonFeature;
  },
): Promise<{ farm: ApiFarmDto }> {
  return apiRequest(`/farms/${encodeURIComponent(farmId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function fetchFarmQr(farmId: string): Promise<{
  data_url: string;
  payload: { farm_id: string; token: string; issued_at: string };
}> {
  return apiRequest(`/farms/${encodeURIComponent(farmId)}/qr`);
}
