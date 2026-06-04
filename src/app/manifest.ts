import type { MetadataRoute } from "next";

import { brand } from "@/data/site-content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.legalName,
    short_name: brand.name,
    description: brand.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#059669",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
