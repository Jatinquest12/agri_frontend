"use client";

import { Card, Pill } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { mockNotifications } from "@/lib/mock-data";

const kindLabel: Record<string, string> = {
  weather: "Weather",
  crop_risk: "Crop risk",
  verification: "Verification",
  admin_message: "Admin",
};

export default function FarmerNotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Weather alerts, crop risk, verification updates, and admin messages."
      />
      {mockNotifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You will see weather and risk alerts here as they arrive."
        />
      ) : (
        <div className="space-y-3">
          {mockNotifications.map((n) => (
            <Card key={n.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {n.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {n.body}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Pill tone="neutral">{kindLabel[n.kind] ?? n.kind}</Pill>
                  {!n.read ? <Pill tone="warn">Unread</Pill> : <Pill tone="ok">Read</Pill>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
