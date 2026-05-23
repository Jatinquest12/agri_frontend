"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, TextArea } from "@/components/ui/field";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import {
  boundaryPointsToGeoJson,
  parseBoundaryJson,
} from "@/lib/geojson-utils";
import {
  CROP_TYPES,
  duplicateFarmCheck,
  registerFarm,
  validateFarmGeoJson,
  type CropType,
} from "@/lib/farms-api";
import type { GeoPoint } from "@/types/platform";

const DEMO_SURVEY = "SURVEY-1001";
const DEMO_AADHAAR = "111122223333";

export default function NewFarmPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [farmerName, setFarmerName] = useState(user?.name ?? "Ramesh Kumar");
  const [aadhaarId, setAadhaarId] = useState(DEMO_AADHAAR);
  const [cropType, setCropType] = useState<CropType>("rice");
  const [areaAcres, setAreaAcres] = useState(3.4);
  const [center, setCenter] = useState<GeoPoint>({ lat: 17.3852, lng: 78.4869 });
  const [boundaryText, setBoundaryText] = useState(
    JSON.stringify(
      [
        { lat: 17.3848, lng: 78.4862 },
        { lat: 17.3848, lng: 78.4874 },
        { lat: 17.3858, lng: 78.4874 },
        { lat: 17.3858, lng: 78.4862 },
        { lat: 17.3848, lng: 78.4862 },
      ],
      null,
      2,
    ),
  );
  const [survey, setSurvey] = useState(DEMO_SURVEY);
  const [landFiles, setLandFiles] = useState<string[]>([]);
  const [cropFiles, setCropFiles] = useState<string[]>([]);
  const [gpsError, setGpsError] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const captureGps = () => {
    setGpsError("");
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setGpsError("Unable to read GPS — check permissions."),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const runDuplicateCheck = useCallback(async () => {
    const points = parseBoundaryJson(boundaryText);
    const geojson = points ? boundaryPointsToGeoJson(points) : undefined;
    try {
      const report = await duplicateFarmCheck({
        aadhaar_id: aadhaarId.trim(),
        land_survey_number: survey.trim(),
        geojson: geojson ?? undefined,
      });
      if (report.duplicate) {
        setDuplicateWarning(
          `Possible duplicate: ${report.matches.map((m) => m.farm_id).join(", ")}`,
        );
      } else {
        setDuplicateWarning(null);
      }
    } catch {
      setDuplicateWarning(null);
    }
  }, [aadhaarId, boundaryText, survey]);

  const submit = async () => {
    setBusy(true);
    setGpsError("");
    try {
      const points = parseBoundaryJson(boundaryText);
      if (points) {
        const geojson = boundaryPointsToGeoJson(points);
        if (geojson) {
          await validateFarmGeoJson(geojson);
        }
      }

      const body = {
        farmer_name: farmerName.trim(),
        aadhaar_id: aadhaarId.trim(),
        land_survey_number: survey.trim(),
        crop_type: cropType,
        land_area_acres: areaAcres,
        gps: { latitude: center.lat, longitude: center.lng },
      };

      const result = await registerFarm(body);
      const farmId = result.farm?.id ?? result.farm_id;
      if (!farmId) {
        throw new Error("Registration succeeded but farm id missing.");
      }

      showToast({
        tone: "success",
        title: "Farm registered",
        description: result.message ?? "Farm is on the registry.",
      });
      router.push(`/farmer/farms/${farmId}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Registration failed.";
      showToast({ tone: "error", title: "Registration failed", description: msg });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Register farm"
        description="Submit to the government registry API. Demo: SURVEY-1001 + Aadhaar 111122223333 with GPS inside the registry polygon."
      />
      <Card title="Farmer & land registry">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Farmer name" className="md:col-span-2">
            <Input
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
            />
          </Field>
          <Field label="Aadhaar ID">
            <Input
              value={aadhaarId}
              onChange={(e) => setAadhaarId(e.target.value)}
              onBlur={() => void runDuplicateCheck()}
            />
          </Field>
          <Field label="Land survey number">
            <Input
              value={survey}
              onChange={(e) => setSurvey(e.target.value)}
              onBlur={() => void runDuplicateCheck()}
            />
          </Field>
          <Field label="Crop type">
            <select
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={cropType}
              onChange={(e) => setCropType(e.target.value as CropType)}
            >
              {CROP_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Area (acres)">
            <Input
              type="number"
              value={areaAcres}
              onChange={(e) => setAreaAcres(Number(e.target.value))}
            />
          </Field>
        </div>
        {duplicateWarning ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            {duplicateWarning}
          </p>
        ) : null}
      </Card>
      <Card title="GPS capture">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Center point must fall inside the government polygon for the survey
          number.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={captureGps}>
            Capture current location
          </Button>
          <span className="text-sm text-slate-700 dark:text-slate-300">
            lat {center.lat.toFixed(5)}, lng {center.lng.toFixed(5)}
          </span>
        </div>
        {gpsError ? (
          <p className="mt-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {gpsError}
          </p>
        ) : null}
      </Card>
      <Card title="Farm boundary (GeoJSON)">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Closed ring of{" "}
          <code className="rounded bg-slate-100 px-1 dark:bg-zinc-800">{`{lat,lng}`}</code>{" "}
          points. Validated via{" "}
          <code className="rounded bg-slate-100 px-1 dark:bg-zinc-800">
            POST /farms/geojson/validate
          </code>{" "}
          when signed in.
        </p>
        <TextArea
          className="mt-3 min-h-[150px] font-mono text-xs"
          value={boundaryText}
          onChange={(e) => setBoundaryText(e.target.value)}
          onBlur={() => void runDuplicateCheck()}
        />
      </Card>
      <Card title="Land documents & crop images">
        <p className="text-sm text-slate-500">
          File upload to storage is Phase 7. Names are kept locally for now.
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="font-medium">Land documents</span>
            <input
              type="file"
              multiple
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              onChange={(e) =>
                setLandFiles(Array.from(e.target.files ?? []).map((f) => f.name))
              }
            />
            {landFiles.length ? (
              <ul className="mt-2 list-inside list-disc text-xs text-slate-600">
                {landFiles.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            ) : null}
          </label>
          <label className="text-sm">
            <span className="font-medium">Crop images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              onChange={(e) =>
                setCropFiles(Array.from(e.target.files ?? []).map((f) => f.name))
              }
            />
          </label>
        </div>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button disabled={busy} onClick={() => void submit()}>
          {busy ? "Registering…" : "Register on backend"}
        </Button>
        <Link href="/farmer/farms" className={buttonClasses({ variant: "secondary" })}>
          Cancel
        </Link>
      </div>
    </div>
  );
}
