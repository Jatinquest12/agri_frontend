"use client";

import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";

const matrix = [
  { role: "farmer", farms: true, proofs: "read", admin: false },
  { role: "agronomist", farms: "review", proofs: "write", admin: false },
  { role: "admin", farms: "full", proofs: "full", admin: true },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Role management"
        description="High-level capability matrix (replace with your RBAC provider)."
      />
      <Card>
        <DataTable className="min-w-[520px]">
          <thead>
            <HeadRow>
              <TH>Role</TH>
              <TH>Farms</TH>
              <TH>Proofs</TH>
              <TH className="pr-0">Admin console</TH>
            </HeadRow>
          </thead>
          <tbody>
            {matrix.map((m) => (
              <BodyRow key={m.role}>
                <TD className="font-medium capitalize">{m.role}</TD>
                <TD>{String(m.farms)}</TD>
                <TD>{m.proofs}</TD>
                <TD className="pr-0">
                  <Pill tone={m.admin ? "ok" : "neutral"}>{m.admin ? "yes" : "no"}</Pill>
                </TD>
              </BodyRow>
            ))}
          </tbody>
        </DataTable>
      </Card>
    </div>
  );
}
