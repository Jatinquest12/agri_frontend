"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";
import { useToast } from "@/context/toast-context";
import { useFarmsFromApi } from "@/hooks/use-farms-from-api";
import { mapApiFarmToPlatform, patchFarm } from "@/lib/farms-api";
import type { FarmStatus } from "@/types/platform";

export default function AdminFarmsPage() {
  const { farms, loading, error, reload } = useFarmsFromApi();
  const [flashRow, setFlashRow] = useState<Record<string, "success" | "warn">>(
    {},
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const { showToast } = useToast();

  const setFlash = (id: string, tone: "success" | "warn") => {
    setFlashRow((prev) => ({ ...prev, [id]: tone }));
    window.setTimeout(() => {
      setFlashRow((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 650);
  };

  const setStatus = useCallback(
    async (farmId: string, ownership_status: "verified" | "rejected") => {
      setBusyId(farmId);
      try {
        const { farm } = await patchFarm(farmId, { ownership_status });
        mapApiFarmToPlatform(farm);
        showToast({
          tone: ownership_status === "verified" ? "success" : "info",
          title:
            ownership_status === "verified" ? "Farm approved" : "Farm rejected",
          description: `Registry updated for ${farmId}.`,
        });
        setFlash(farmId, ownership_status === "verified" ? "success" : "warn");
        await reload();
      } catch (err) {
        showToast({
          tone: "error",
          title: "Update failed",
          description:
            err instanceof Error ? err.message : "Could not update farm.",
        });
      } finally {
        setBusyId(null);
      }
    },
    [reload, showToast],
  );

  const statusTone = (s: FarmStatus) => {
    if (s === "approved") return "ok" as const;
    if (s === "rejected") return "bad" as const;
    return "warn" as const;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farm registry"
        description="All farms from GET /api/farms. Approve or reject updates ownership via PATCH (admin)."
      />
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {error}{" "}
          <button type="button" className="underline" onClick={() => void reload()}>
            Retry
          </button>
        </p>
      ) : null}
      <Card>
        {loading && farms.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">Loading farms…</p>
        ) : null}
        {!loading && farms.length === 0 ? (
          <EmptyState
            title="No farms"
            description="Register a farm from the farmer portal to review it here."
          />
        ) : null}
        {farms.length > 0 ? (
          <DataTable>
            <thead>
              <HeadRow>
                <TH>Farm</TH>
                <TH>Farmer</TH>
                <TH>Survey</TH>
                <TH>Status</TH>
                <TH className="pr-0">Actions</TH>
              </HeadRow>
            </thead>
            <tbody>
              {farms.map((f) => (
                <BodyRow
                  key={f.id}
                  className={
                    flashRow[f.id] === "success"
                      ? "row-flash-success"
                      : flashRow[f.id] === "warn"
                        ? "row-flash-warn"
                        : ""
                  }
                >
                  <TD className="font-medium">{f.name}</TD>
                  <TD>{f.farmerName ?? "—"}</TD>
                  <TD className="font-mono text-xs">{f.surveyNumber ?? "—"}</TD>
                  <TD>
                    <Pill tone={statusTone(f.status)}>{f.status}</Pill>
                  </TD>
                  <TD className="pr-0">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={busyId === f.id || f.status === "approved"}
                        onClick={() => void setStatus(f.id, "verified")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={busyId === f.id || f.status === "rejected"}
                        onClick={() => void setStatus(f.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  </TD>
                </BodyRow>
              ))}
            </tbody>
          </DataTable>
        ) : null}
      </Card>
    </div>
  );
}
