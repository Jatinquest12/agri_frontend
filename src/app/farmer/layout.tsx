import type { Metadata } from "next";

import { brand } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Farmer workspace",
  description: `Farmer portal for ${brand.name} — register farms, view insights, and manage proof.`,
  robots: { index: false, follow: false },
};

export default function FarmerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
