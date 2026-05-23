import { apiRequest } from "./api";

export type DashboardAnalytics = {
  totals: {
    farms: number;
    proofs: number;
    ingestion_jobs_queued: number;
    notifications_pending: number;
  };
  crops: Record<string, number>;
  health: { average: number; sample_size: number };
  ai: { farms_with_ai: number; anomaly_count: number };
  ingestion: { completed: number; failed: number; queued: number };
};

export type CropTrendsResponse = {
  trends: {
    crop_type: string;
    farm_count: number;
    avg_health: number;
    avg_ndvi: number;
    avg_yield_prediction: number;
  }[];
};

export function fetchDashboardAnalytics(): Promise<DashboardAnalytics> {
  return apiRequest<DashboardAnalytics>("/analytics/dashboard");
}

export function fetchCropTrends(): Promise<CropTrendsResponse> {
  return apiRequest<CropTrendsResponse>("/analytics/crops/trends");
}

export function fetchFarmAnalytics(farmId: string): Promise<{
  farm_id: string;
  crop_type: string;
  normalized_series: {
    timestamp: string;
    ndvi: number;
    rainfall: number;
    temperature: number;
  }[];
  proof_count: number;
  ai_latest?: {
    health_score: number;
    predicted_yield: number;
    anomaly_flag: boolean;
  };
}> {
  return apiRequest(`/analytics/farms/${encodeURIComponent(farmId)}`);
}
