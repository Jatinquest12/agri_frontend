"use client";

import { useAuth } from "@/context/auth-context";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { PageHeader } from "@/components/ui/page-header";

export default function FarmerProfilePage() {
  const { user, updateProfile } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description={`Role: ${user.role} — maintain contact and identity details.`}
      />
      <Card title="Identity">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Full name">
            <Input
              value={user.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <Input
              value={user.phone ?? ""}
              onChange={(e) => updateProfile({ phone: e.target.value })}
            />
          </Field>
          <Field label="Email" className="md:col-span-2">
            <Input
              value={user.email ?? ""}
              onChange={(e) => updateProfile({ email: e.target.value })}
            />
          </Field>
        </div>
      </Card>
      <Card title="Verification">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Account status:{" "}
          <strong>{user.verified ? "Verified" : "Pending"}</strong>. Document
          uploads will plug into your backend KYC pipeline.
        </p>
      </Card>
    </div>
  );
}
