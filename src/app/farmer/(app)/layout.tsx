import { FarmerShell } from "@/components/layout/farmer-shell";

export default function FarmerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FarmerShell>{children}</FarmerShell>;
}
