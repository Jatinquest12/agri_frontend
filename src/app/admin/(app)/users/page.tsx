"use client";

import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";

const users = [
  { id: "u1", name: "Demo Farmer", role: "farmer", email: "farmer@demo" },
  { id: "u2", name: "Platform Admin", role: "admin", email: "admin@demo" },
  { id: "u3", name: "Agronomist", role: "agronomist", email: "agro@demo" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User management"
        description="Directory view — wire to your IAM / user service."
      />
      <Card>
        <DataTable className="min-w-[520px]">
          <thead>
            <HeadRow>
              <TH>Name</TH>
              <TH>Email</TH>
              <TH className="pr-0">Role</TH>
            </HeadRow>
          </thead>
          <tbody>
            {users.map((u) => (
              <BodyRow key={u.id}>
                <TD className="font-medium">{u.name}</TD>
                <TD>{u.email}</TD>
                <TD className="pr-0">
                  <Pill tone="neutral">{u.role}</Pill>
                </TD>
              </BodyRow>
            ))}
          </tbody>
        </DataTable>
      </Card>
    </div>
  );
}
