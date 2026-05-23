"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { SimpleLineChart } from "@/components/charts/simple-line-chart";
import {
  fetchCropTrends,
  fetchDashboardAnalytics,
  type CropTrendsResponse,
  type DashboardAnalytics,
} from "@/lib/analytics-api";

export default function AdminAnalyticsPage() {
  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null);
  const [trends, setTrends] = useState<CropTrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [d, t] = await Promise.all([
          fetchDashboardAnalytics(),
          fetchCropTrends(),
        ]);
        if (!cancelled) {
          setDashboard(d);
          setTrends(t);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const distribution = dashboard
    ? Object.entries(dashboard.crops).map(([label, value]) => ({
        label,
        value,
      }))
    : [];

  const trendChart =
    trends?.trends.map((t) => ({
      label: t.crop_type,
      value: Math.round(t.avg_health * 10) / 10,
    })) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Live dashboard from GET /api/analytics/dashboard and crop trends API."
      />
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Analytics API error: {error}
        </p>
      ) : null}
      {loading && !dashboard ? (
        <p className="text-sm text-slate-500">Loading analytics…</p>
      ) : null}
      {dashboard ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card title="Total farms">
              <p className="text-4xl font-bold">
                <CountUp value={dashboard.totals.farms} />
              </p>
            </Card>
            <Card title="Avg health score">
              <p className="text-4xl font-bold">
                <CountUp value={dashboard.health.average} decimals={1} />
              </p>
              <p className="mt-1 text-xs text-slate-500">
                n={dashboard.health.sample_size} farms with AI
              </p>
            </Card>
            <Card title="Proofs issued">
              <p className="text-4xl font-bold">
                <CountUp value={dashboard.totals.proofs} />
              </p>
            </Card>
            <Card title="AI anomalies">
              <p className="text-4xl font-bold">
                <CountUp value={dashboard.ai.anomaly_count} />
              </p>
            </Card>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Crop-wise distribution">
              {distribution.length ? (
                <SimpleLineChart data={distribution} color="#0f172a" />
              ) : (
                <EmptyState
                  title="No farm data"
                  description="Register farms to see crop distribution."
                />
              )}
            </Card>
            <Card title="Crop health trends (avg)">
              {trendChart.length ? (
                <SimpleLineChart data={trendChart} color="#059669" />
              ) : (
                <EmptyState
                  title="No trend data"
                  description="Run AI on farms to populate health trends."
                />
              )}
            </Card>
          </div>
          <Card title="Ingestion pipeline">
            <ul className="grid gap-2 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-3">
              <li>Queued: {dashboard.ingestion.queued}</li>
              <li>Completed: {dashboard.ingestion.completed}</li>
              <li>Failed: {dashboard.ingestion.failed}</li>
            </ul>
          </Card>
        </>
      ) : null}
    </div>
  );
}
