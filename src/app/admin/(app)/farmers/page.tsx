"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";
import { useToast } from "@/context/toast-context";
import { mockPendingFarmers } from "@/lib/mock-data";

export default function AdminFarmersPage() {
  const [rows, setRows] = useState(mockPendingFarmers);
  const [flashRow, setFlashRow] = useState<Record<string, "success" | "warn">>(
    {},
  );
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farmer approvals"
        description="KYC queue with approve / reject actions."
      />
      <Card>
        <DataTable>
          <thead>
            <HeadRow>
              <TH>Farmer</TH>
              <TH>Phone</TH>
              <TH>Submitted</TH>
              <TH>Status</TH>
              <TH className="pr-0">Actions</TH>
            </HeadRow>
          </thead>
          <tbody>
            {rows.map((r) => (
              <BodyRow
                key={r.id}
                className={
                  flashRow[r.id] === "success"
                    ? "row-flash-success"
                    : flashRow[r.id] === "warn"
                      ? "row-flash-warn"
                      : ""
                }
              >
                <TD className="font-medium">{r.name}</TD>
                <TD>{r.phone}</TD>
                <TD className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(r.submittedAt).toLocaleString()}
                </TD>
                <TD>
                  <Pill tone={r.status === "approved" ? "ok" : r.status === "rejected" ? "bad" : "warn"}>
                    {r.status}
                  </Pill>
                </TD>
                <TD className="pr-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setRows((prev) =>
                          prev.map((x) =>
                            x.id === r.id ? { ...x, status: "approved" } : x,
                          ),
                        );
                        showToast({
                          tone: "success",
                          title: "Farmer approved",
                          description: `${r.name} moved to approved.`,
                        });
                        setFlash(r.id, "success");
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setRows((prev) =>
                          prev.map((x) =>
                            x.id === r.id ? { ...x, status: "rejected" } : x,
                          ),
                        );
                        showToast({
                          tone: "info",
                          title: "Farmer rejected",
                          description: `${r.name} marked rejected.`,
                        });
                        setFlash(r.id, "warn");
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </TD>
              </BodyRow>
            ))}
          </tbody>
        </DataTable>
      </Card>
    </div>
  );
}
