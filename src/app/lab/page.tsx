"use client";

import { useState } from "react";

type ApiMap = Record<string, unknown>;

const defaultApiBase =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE ?? "http://localhost:5000/api";

const sectionClass =
  "rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm";

export default function LabConsolePage() {
  const [apiBase, setApiBase] = useState(defaultApiBase);
  const [farmId, setFarmId] = useState("");
  const [farmerId, setFarmerId] = useState("111122223333");
  const [qrToken, setQrToken] = useState("");
  const [responses, setResponses] = useState<ApiMap>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [registration, setRegistration] = useState({
    farmer_name: "Ramesh Kumar",
    aadhaar_id: "111122223333",
    land_survey_number: "SURVEY-1001",
    crop_type: "rice",
    land_area_acres: 3.4,
    latitude: 17.3852,
    longitude: 78.4869,
  });

  const [iot, setIot] = useState({
    soil_moisture: 36,
    temperature: 29,
  });
  const [satellite, setSatellite] = useState({
    ndvi_index: 0.62,
    crop_index: 0.71,
  });
  const [bhuvan, setBhuvan] = useState({
    distcode: "2301",
    year: "1112" as "0506" | "1112",
  });
  const [weather, setWeather] = useState({
    rainfall: 31,
    temperature: 28,
  });
  const [healthThreshold, setHealthThreshold] = useState(45);
  const [product, setProduct] = useState({
    product_name: "Rice Sack",
    batch_number: "BATCH-001",
  });

  const request = async (
    path: string,
    options?: RequestInit,
  ): Promise<unknown> => {
    const response = await fetch(`${apiBase}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const data = (await response.json()) as { message?: string } & ApiMap;
    if (!response.ok) {
      throw new Error(data.message ?? "Request failed");
    }
    return data;
  };

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setError("");
    setBusy(true);
    try {
      const data = await fn();
      setResponses((prev) => ({ ...prev, [key]: data }));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unexpected request error",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
        <section className={sectionClass}>
          <h1 className="text-2xl font-bold text-emerald-900">
            Agritrust End-to-End Console
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Execute farm registration, ingestion, AI, proof, insurance, credit,
            and marketplace QR verification from one screen.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Backend API Base</span>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                value={apiBase}
                onChange={(event) => setApiBase(event.target.value)}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Current Farm ID</span>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                value={farmId}
                onChange={(event) => setFarmId(event.target.value)}
              />
            </label>
          </div>
          {error ? (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">1) Farm Registration</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-md border px-3 py-2"
              value={registration.farmer_name}
              onChange={(event) =>
                setRegistration((prev) => ({
                  ...prev,
                  farmer_name: event.target.value,
                }))
              }
              placeholder="farmer_name"
            />
            <input
              className="rounded-md border px-3 py-2"
              value={registration.aadhaar_id}
              onChange={(event) =>
                setRegistration((prev) => ({
                  ...prev,
                  aadhaar_id: event.target.value,
                }))
              }
              placeholder="aadhaar_id"
            />
            <input
              className="rounded-md border px-3 py-2"
              value={registration.land_survey_number}
              onChange={(event) =>
                setRegistration((prev) => ({
                  ...prev,
                  land_survey_number: event.target.value,
                }))
              }
              placeholder="land_survey_number"
            />
            <input
              className="rounded-md border px-3 py-2"
              value={registration.crop_type}
              onChange={(event) =>
                setRegistration((prev) => ({ ...prev, crop_type: event.target.value }))
              }
              placeholder="crop_type"
            />
            <input
              className="rounded-md border px-3 py-2"
              type="number"
              value={registration.land_area_acres}
              onChange={(event) =>
                setRegistration((prev) => ({
                  ...prev,
                  land_area_acres: Number(event.target.value),
                }))
              }
              placeholder="land_area_acres"
            />
            <button
              className="rounded-md bg-emerald-700 px-3 py-2 font-medium text-white disabled:opacity-60"
              disabled={busy}
              onClick={() =>
                run("registration", async () => {
                  const data = (await request("/farms/register", {
                    method: "POST",
                    body: JSON.stringify({
                      farmer_name: registration.farmer_name,
                      aadhaar_id: registration.aadhaar_id,
                      land_survey_number: registration.land_survey_number,
                      crop_type: registration.crop_type,
                      land_area_acres: registration.land_area_acres,
                      gps: {
                        latitude: registration.latitude,
                        longitude: registration.longitude,
                      },
                    }),
                  })) as { farm?: { id?: string; aadhaar_id?: string } };

                  if (data.farm?.id) {
                    setFarmId(data.farm.id);
                  }
                  if (data.farm?.aadhaar_id) {
                    setFarmerId(data.farm.aadhaar_id);
                  }
                  return data;
                })
              }
            >
              Register Farm
            </button>
            <input
              className="rounded-md border px-3 py-2"
              type="number"
              value={registration.latitude}
              onChange={(event) =>
                setRegistration((prev) => ({
                  ...prev,
                  latitude: Number(event.target.value),
                }))
              }
              placeholder="latitude"
            />
            <input
              className="rounded-md border px-3 py-2"
              type="number"
              value={registration.longitude}
              onChange={(event) =>
                setRegistration((prev) => ({
                  ...prev,
                  longitude: Number(event.target.value),
                }))
              }
              placeholder="longitude"
            />
          </div>
          <ResponseBlock data={responses.registration} />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">2) Data Ingestion Pipeline</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <button
              className="rounded-md bg-slate-800 px-3 py-2 text-white disabled:opacity-60"
              disabled={!farmId || busy}
              onClick={() =>
                run("ingest_iot", () =>
                  request(`/monitoring/${farmId}/ingest/iot`, {
                    method: "POST",
                    body: JSON.stringify(iot),
                  }),
                )
              }
            >
              Ingest IoT
            </button>
            <button
              className="rounded-md bg-slate-800 px-3 py-2 text-white disabled:opacity-60"
              disabled={!farmId || busy}
              onClick={() =>
                run("ingest_satellite", () =>
                  request(`/monitoring/${farmId}/ingest/satellite`, {
                    method: "POST",
                    body: JSON.stringify(satellite),
                  }),
                )
              }
            >
              Ingest Satellite
            </button>
            <button
              className="rounded-md bg-indigo-700 px-3 py-2 text-white disabled:opacity-60"
              disabled={!farmId || busy}
              onClick={() =>
                run("ingest_bhuvan_satellite", () =>
                  request(`/monitoring/${farmId}/ingest/satellite`, {
                    method: "POST",
                    body: JSON.stringify({
                      fetch_bhuvan: true,
                      year: bhuvan.year,
                      distcode: bhuvan.distcode,
                    }),
                  }),
                )
              }
            >
              Ingest Bhuvan + NASA
            </button>
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-white disabled:opacity-60"
              disabled={busy}
              onClick={() => {
                const q = new URLSearchParams({
                  distcode: bhuvan.distcode,
                  year: bhuvan.year,
                });
                if (farmId) q.set("farm_id", farmId);
                return run("bhuvan_lulc", () =>
                  request(`/satellite/lulc?${q.toString()}`),
                );
              }}
            >
              Bhuvan LULC
            </button>
            <button
              className="rounded-md bg-slate-800 px-3 py-2 text-white disabled:opacity-60"
              disabled={!farmId || busy}
              onClick={() =>
                run("ingest_weather", () =>
                  request(`/monitoring/${farmId}/ingest/weather`, {
                    method: "POST",
                    body: JSON.stringify(weather),
                  }),
                )
              }
            >
              Ingest Weather
            </button>
            <input
              className="rounded-md border px-3 py-2"
              type="number"
              value={iot.soil_moisture}
              onChange={(event) =>
                setIot((prev) => ({ ...prev, soil_moisture: Number(event.target.value) }))
              }
              placeholder="soil_moisture"
            />
            <input
              className="rounded-md border px-3 py-2"
              type="number"
              value={satellite.ndvi_index}
              onChange={(event) =>
                setSatellite((prev) => ({
                  ...prev,
                  ndvi_index: Number(event.target.value),
                }))
              }
              placeholder="ndvi_index"
            />
            <input
              className="rounded-md border px-3 py-2"
              value={bhuvan.distcode}
              onChange={(event) =>
                setBhuvan((prev) => ({ ...prev, distcode: event.target.value }))
              }
              placeholder="Bhuvan distcode"
            />
            <select
              className="rounded-md border px-3 py-2"
              value={bhuvan.year}
              onChange={(event) =>
                setBhuvan((prev) => ({
                  ...prev,
                  year: event.target.value as "0506" | "1112",
                }))
              }
            >
              <option value="1112">LULC 2011-12</option>
              <option value="0506">LULC 2005-06</option>
            </select>
            <input
              className="rounded-md border px-3 py-2"
              type="number"
              value={weather.rainfall}
              onChange={(event) =>
                setWeather((prev) => ({ ...prev, rainfall: Number(event.target.value) }))
              }
              placeholder="rainfall"
            />
            <button
              className="rounded-md bg-emerald-700 px-3 py-2 font-medium text-white disabled:opacity-60"
              disabled={!farmId || busy}
              onClick={() =>
                run("normalized", () =>
                  request(`/monitoring/${farmId}/normalize`, { method: "POST" }),
                )
              }
            >
              Normalize
            </button>
          </div>
          <ResponseBlock
            data={{
              ingest_iot: responses.ingest_iot,
              ingest_satellite: responses.ingest_satellite,
              ingest_weather: responses.ingest_weather,
              normalized: responses.normalized,
            }}
          />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">3-5) AI, Proof, Insurance</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <button
              className="rounded-md bg-slate-800 px-3 py-2 text-white disabled:opacity-60"
              disabled={!farmId || busy}
              onClick={() =>
                run("ai_output", () =>
                  request(`/monitoring/${farmId}/ai/run`, { method: "POST" }),
                )
              }
            >
              Run AI
            </button>
            <button
              className="rounded-md bg-slate-800 px-3 py-2 text-white disabled:opacity-60"
              disabled={!farmId || busy}
              onClick={() =>
                run("proof", () =>
                  request(`/poa/${farmId}/generate`, { method: "POST" }),
                )
              }
            >
              Generate Proof
            </button>
            <input
              className="rounded-md border px-3 py-2"
              type="number"
              value={healthThreshold}
              onChange={(event) => setHealthThreshold(Number(event.target.value))}
              placeholder="health threshold"
            />
            <button
              className="rounded-md bg-emerald-700 px-3 py-2 font-medium text-white disabled:opacity-60"
              disabled={!farmId || busy}
              onClick={() =>
                run("insurance", () =>
                  request(`/insurance/${farmId}/evaluate`, {
                    method: "POST",
                    body: JSON.stringify({
                      health_score_threshold: healthThreshold,
                    }),
                  }),
                )
              }
            >
              Evaluate Insurance
            </button>
          </div>
          <ResponseBlock
            data={{
              ai_output: responses.ai_output,
              proof: responses.proof,
              insurance: responses.insurance,
            }}
          />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">6) Credit Profile</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-md border px-3 py-2"
              value={farmerId}
              onChange={(event) => setFarmerId(event.target.value)}
              placeholder="farmer id (aadhaar)"
            />
            <button
              className="rounded-md bg-emerald-700 px-3 py-2 font-medium text-white disabled:opacity-60"
              disabled={!farmerId || busy}
              onClick={() =>
                run("credit_profile", () =>
                  request(`/farmer/${farmerId}/credit-profile`),
                )
              }
            >
              Fetch Credit Profile
            </button>
          </div>
          <ResponseBlock data={responses.credit_profile} />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">7) Marketplace Verification</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <input
              className="rounded-md border px-3 py-2"
              value={product.product_name}
              onChange={(event) =>
                setProduct((prev) => ({ ...prev, product_name: event.target.value }))
              }
              placeholder="product_name"
            />
            <input
              className="rounded-md border px-3 py-2"
              value={product.batch_number}
              onChange={(event) =>
                setProduct((prev) => ({ ...prev, batch_number: event.target.value }))
              }
              placeholder="batch_number"
            />
            <button
              className="rounded-md bg-slate-800 px-3 py-2 text-white disabled:opacity-60"
              disabled={!farmId || busy}
              onClick={() =>
                run("tag_product", async () => {
                  const data = (await request(
                    `/traceability/${farmId}/products/tag`,
                    {
                      method: "POST",
                      body: JSON.stringify(product),
                    },
                  )) as { traceability?: { qr_token?: string } };
                  if (data.traceability?.qr_token) {
                    setQrToken(data.traceability.qr_token);
                  }
                  return data;
                })
              }
            >
              Tag Product
            </button>
            <input
              className="rounded-md border px-3 py-2"
              value={qrToken}
              onChange={(event) => setQrToken(event.target.value)}
              placeholder="qr token"
            />
            <button
              className="rounded-md bg-emerald-700 px-3 py-2 font-medium text-white disabled:opacity-60"
              disabled={!qrToken || busy}
              onClick={() =>
                run("qr_verification", () =>
                  request(`/traceability/scan/${qrToken}`),
                )
              }
            >
              Scan & Verify
            </button>
          </div>
          <ResponseBlock
            data={{
              tag_product: responses.tag_product,
              qr_verification: responses.qr_verification,
            }}
          />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">One-Click Full Cycle</h2>
          <button
            className="mt-3 rounded-md bg-emerald-800 px-4 py-2 font-medium text-white disabled:opacity-60"
            disabled={!farmId || busy}
            onClick={() =>
              run("workflow", () =>
                request(`/workflow/${farmId}/run-cycle`, {
                  method: "POST",
                  body: JSON.stringify({
                    iot,
                    satellite,
                    weather,
                    product,
                    claim_threshold: healthThreshold,
                  }),
                }),
              )
            }
          >
            Run End-to-End Workflow
          </button>
          <ResponseBlock data={responses.workflow} />
        </section>
      </main>
    </div>
  );
}

function ResponseBlock({ data }: { data: unknown }) {
  if (!data) {
    return null;
  }

  return (
    <pre className="mt-3 max-h-72 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-100">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
