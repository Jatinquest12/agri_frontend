import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { brand } from "@/data/site-content";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "Agritrust is a farm registry and verification platform for crop monitoring, admin operations, blockchain-backed proof of agriculture, and public supply-chain checks.";

export const metadata: Metadata = {
  title: {
    default: `${brand.name} | Farm registry & verification`,
    template: `%s | ${brand.name}`,
  },
  description: siteDescription,
  keywords: [
    "agriculture",
    "farm registry",
    "crop monitoring",
    "proof of agriculture",
    "traceability",
    "Hyperledger",
  ],
  authors: [{ name: brand.name }],
  openGraph: {
    title: `${brand.name} | Farm registry & verification`,
    description: siteDescription,
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
