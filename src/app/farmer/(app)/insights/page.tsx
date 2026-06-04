"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, Pill } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { SimpleLineChart } from "@/components/charts/simple-line-chart";
import { LulcBarChart } from "@/components/charts/lulc-bar-chart";
import { Field } from "@/components/ui/field";
import { mockAiAlerts } from "@/lib/mock-data";
import { fetchFarmAnalytics } from "@/lib/analytics-api";
import {
  fetchFarmLulc,
  type BhuvanLulcStats,
  type BhuvanLulcYear,
} from "@/lib/satellite-api";
import { useFarmsFromApi } from "@/hooks/use-farms-from-api";
import type { Farm } from "@/types/platform";

export default function FarmerInsightsPage() {
  const { farms, loading, error } = useFarmsFromApi();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lulcYear, setLulcYear] = useState<BhuvanLulcYear>("1112");
  const [districtCode, setDistrictCode] = useState("");
  const [lulc, setLulc] = useState<BhuvanLulcStats | null>(null);
  const [lulcError, setLulcError] = useState("");
  const [lulcLoading, setLulcLoading] = useState(false);

  useEffect(() => {
    if (selectedId !== null || farms.length === 0) return;
    setSelectedId(farms[0].id);
  }, [farms, selectedId]);

  const primary: Farm | undefined = useMemo(
    () => farms.find((f) => f.id === selectedId) ?? farms[0],
    [farms, selectedId],
  );

  const [series, setSeries] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    if (!primary?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchFarmAnalytics(primary.id);
        if (cancelled) return;
        setSeries(
          data.normalized_series.map((p) => ({
            label: new Date(p.timestamp).toLocaleDateString(),
            value: Math.round(p.ndvi * 100) / 100,
          })),
        );
      } catch {
        if (!cancelled) setSeries([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [primary?.id]);

  useEffect(() => {
    if (!primary?.id) return;
    let cancelled = false;
    (async () => {
      setLulcLoading(true);
      setLulcError("");
      try {
        const data = await fetchFarmLulc(primary.id, {
          year: lulcYear,
          distcode: districtCode.trim() || undefined,
        });
        if (!cancelled) setLulc(data.lulc);
      } catch (e) {
        if (!cancelled) {
          setLulc(null);
          setLulcError((e as Error).message);
        }
      } finally {
        if (!cancelled) setLulcLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [primary?.id, lulcYear, districtCode]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI insights"
        description="Health score, yield outlook, and anomaly alerts."
      />
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Could not load farms: {error}
        </p>
      ) : null}
      {!loading && !primary ? (
        <EmptyState
          title="No farm data available"
          description="Register at least one farm via the backend to view AI placeholders here."
        />
      ) : null}
      {farms.length > 1 && primary ? (
        <Card title="Select farm">
          <Field label="Farm">
            <select
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={primary.id}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </Field>
        </Card>
      ) : null}
      {loading && !primary ? (
        <p className="text-sm text-slate-500">Loading farm data…</p>
      ) : null}
      {primary ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Crop health score">
              <p className="text-4xl font-bold text-emerald-800 dark:text-emerald-200">
                <CountUp value={primary.healthScore ?? 0} />
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Blended NDVI + on-ground signals
              </p>
            </Card>
            <Card title="Crop type">
              <p className="text-2xl font-semibold">{primary.cropType}</p>
              <Pill tone="neutral">Model confidence</Pill>
            </Card>
            <Card title="Yield prediction">
              <p className="text-2xl font-semibold">
                <CountUp value={primary.yieldPredictionKg} /> kg
              </p>
              <p className="mt-1 text-xs text-slate-500">Season-to-date forecast</p>
            </Card>
          </div>
          <Card title="NDVI trend (normalized ingestion)">
            {series.length ? (
              <SimpleLineChart data={series} color="#059669" />
            ) : (
              <p className="text-sm text-slate-500">
                Ingest satellite/weather data for this farm to populate trends.
              </p>
            )}
          </Card>
          <Card
            title="Land use / land cover (Bhuvan LULC 50k)"
            subtitle="District or state statistics from ISRO Bhuvan NRSC"
          >
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <Field label="Bhuvan district code (optional override)">
                <input
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder="e.g. 2301 (Khammam)"
                  value={districtCode}
                  onChange={(e) => setDistrictCode(e.target.value)}
                />
              </Field>
              <Field label="Survey year">
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                  value={lulcYear}
                  onChange={(e) => setLulcYear(e.target.value as BhuvanLulcYear)}
                >
                  <option value="1112">2011–2012</option>
                  <option value="0506">2005–2006</option>
                </select>
              </Field>
            </div>
            {lulcLoading ? (
              <p className="text-sm text-slate-500">Loading Bhuvan LULC…</p>
            ) : null}
            {lulcError ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                {lulcError}
                {" "}
                Set <code className="text-xs">BHUVAN_LULC_TOKEN</code> on the backend and
                assign a <code className="text-xs">district_code</code> to the farm, or enter
                a district code above.
              </p>
            ) : null}
            {lulc ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="neutral">{lulc.name}</Pill>
                  <Pill tone="neutral">
                    {lulc.scope === "district" ? "District" : "State"} {lulc.scope_code}
                  </Pill>
                  <Pill tone="ok">
                    Agricultural cover {lulc.agricultural_percent.toFixed(1)}%
                  </Pill>
                </div>
                <LulcBarChart
                  data={lulc.classes.map((c) => ({
                    label: c.label,
                    percent: c.percent,
                    area_sqkm: c.area_sqkm,
                  }))}
                />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[420px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                        <th className="py-2 pr-3 font-medium">Class</th>
                        <th className="py-2 pr-3 font-medium">Area (km²)</th>
                        <th className="py-2 font-medium">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lulc.classes.map((row) => (
                        <tr
                          key={row.code}
                          className="border-b border-slate-100 dark:border-slate-900"
                        >
                          <td className="py-2 pr-3">{row.label}</td>
                          <td className="py-2 pr-3 tabular-nums">
                            {row.area_sqkm.toFixed(2)}
                          </td>
                          <td className="py-2 tabular-nums">{row.percent.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-500">
                  Total mapped area: {lulc.total_area_sqkm.toFixed(2)} km² · Crop index{" "}
                  {lulc.crop_index.toFixed(2)} (used to blend NDVI during satellite ingest)
                </p>
              </div>
            ) : null}
          </Card>
          <Card title="Disease / anomaly alerts">
            <ul className="space-y-3">
              {mockAiAlerts.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-slate-200 p-3 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{a.title}</p>
                    <Pill
                      tone={
                        a.severity === "critical"
                          ? "bad"
                          : a.severity === "warn"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {a.severity}
                    </Pill>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {a.detail}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : null}
    </div>
  );
}
