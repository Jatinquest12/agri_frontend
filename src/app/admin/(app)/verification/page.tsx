"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { BodyRow, DataTable, HeadRow, TD, TH } from "@/components/ui/table";
import { mockAudit } from "@/lib/mock-data";
import { FabricGatewayStatusCard } from "@/components/verification/fabric-gateway-status-card";
import { ProofHashVerifyCard } from "@/components/verification/proof-hash-verify-card";

export default function AdminVerificationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification dashboard"
        description="Gateway health, proof checks against the backend, audit logs, and tamper indicators."
      />
      <FabricGatewayStatusCard />
      <ProofHashVerifyCard />
      <Card title="Audit logs">
      <DataTable className="min-w-[620px]">
        <thead>
          <HeadRow>
            <TH>Time</TH>
            <TH>Actor</TH>
            <TH>Action</TH>
            <TH className="pr-0">Target</TH>
          </HeadRow>
        </thead>
        <tbody>
          {mockAudit.map((a) => (
            <BodyRow key={a.id}>
              <TD className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(a.at).toLocaleString()}
              </TD>
              <TD>{a.actor}</TD>
              <TD className="font-mono text-xs">{a.action}</TD>
              <TD className="pr-0 font-mono text-xs">{a.target}</TD>
            </BodyRow>
          ))}
        </tbody>
      </DataTable>
      </Card>
    </div>
  );
}
