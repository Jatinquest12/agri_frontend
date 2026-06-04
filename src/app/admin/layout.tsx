import type { Metadata } from "next";

import { brand } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Admin console",
  description: `Operations console for ${brand.name} — approvals, analytics, and verification.`,
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
